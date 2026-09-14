import type { Prisma, TeamMember } from "@prisma/client";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import { TEAM_MAX_MEMBERS, TEAM_MIN_MEMBERS } from "../schemas/team.schema.js";
import type { AddMemberInput, CreateTeamInput, UpdateTeamInput } from "../schemas/team.schema.js";
import { resolveProblemSelection } from "./problemStatement.service.js";
import { sendTeamMemberAddedEmail, sendTeamRegistrationEmail } from "../utils/mailer.js";

export interface UploadedIdCard {
  /** multer's on-disk filename (a UUID, not the client's original name). */
  path: string;
  mimetype: string;
  originalname: string;
}

export async function createTeam(leaderUserId: string, input: CreateTeamInput, idCard: UploadedIdCard) {
  const existing = await prisma.team.findFirst({ where: { leaderUserId } });
  if (existing) {
    // The upload already landed on disk before this check runs (multer
    // parses the request before validateBody/the controller ever executes),
    // so the now-orphaned file is cleaned up rather than left behind for
    // every rejected duplicate-registration attempt.
    await deleteUploadedFile(idCard.path);
    throw new AppError(409, "You have already registered a team.");
  }

  const leader = await prisma.user.findUniqueOrThrow({ where: { id: leaderUserId } });

  // Create the team and seed the leader as the first team_members row in
  // one transaction, so team_members is always the single source of truth
  // for roster membership (no team can exist with zero members). The
  // problem-selection resolution (which may assign a sequence number) also
  // has to be inside this same transaction - see problemStatement.service.ts.
  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const { theme, problemStatement, problemStatementId } = await resolveProblemSelection(tx, input);

      const team = await tx.team.create({
        data: {
          name: input.name,
          institute: input.institute,
          institutionAddress: input.institutionAddress,
          theme,
          problemStatement,
          problemCategoryCode: input.problemCategoryCode,
          problemOptionType: input.problemOptionType,
          proposedProblemStatement: input.problemOptionType === "open" ? input.proposedProblemStatement : null,
          problemStatementId,
          idCardPath: idCard.path,
          idCardMimeType: idCard.mimetype,
          idCardOriginalName: idCard.originalname,
          leaderUserId,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: leader.id,
          firstName: leader.firstName,
          lastName: leader.lastName,
          email: leader.email,
          phone: leader.phone,
          role: "leader",
        },
      });

      return team;
    });
  } catch (err) {
    // Team creation failed after the file was already written to disk -
    // clean it up rather than leaking an unreferenced upload.
    await deleteUploadedFile(idCard.path);
    throw err;
  }
}

export async function updateTeam(
  teamId: string,
  leaderUserId: string,
  input: UpdateTeamInput,
  idCard: UploadedIdCard | undefined,
) {
  const existingTeam = await getOwnedTeamOrThrow(teamId, leaderUserId); // also enforces draft-only via its status check
  const previousIdCardPath = existingTeam.idCardPath;

  let updated: Awaited<ReturnType<typeof prisma.team.update>>;
  try {
    updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const { theme, problemStatement, problemStatementId } = await resolveProblemSelection(tx, input);

      return tx.team.update({
        where: { id: teamId },
        data: {
          name: input.name,
          institute: input.institute,
          institutionAddress: input.institutionAddress,
          theme,
          problemStatement,
          problemCategoryCode: input.problemCategoryCode,
          problemOptionType: input.problemOptionType,
          proposedProblemStatement: input.problemOptionType === "open" ? input.proposedProblemStatement : null,
          problemStatementId,
          ...(idCard && {
            idCardPath: idCard.path,
            idCardMimeType: idCard.mimetype,
            idCardOriginalName: idCard.originalname,
          }),
        },
      });
    });
  } catch (err) {
    // The update did not commit - the NEW upload (if any) is orphaned and
    // the OLD file is still the one actually referenced by the team, so
    // only the new one is cleaned up here.
    if (idCard) await deleteUploadedFile(idCard.path);
    throw err;
  }

  // Update committed. Only now, on the success path, is the PREVIOUS card
  // actually superseded and safe to remove.
  if (idCard && previousIdCardPath && previousIdCardPath !== idCard.path) {
    await deleteUploadedFile(previousIdCardPath).catch(() => {
      // Best-effort: an orphaned old file is a disk-space nuisance, not a
      // correctness problem, so this must never fail the request itself.
    });
  }

  return updated;
}

async function deleteUploadedFile(storedFilename: string) {
  try {
    await unlink(path.join(env.UPLOAD_DIR, path.basename(storedFilename)));
  } catch {
    // File may already be gone, or never existed (e.g. called on a bad
    // input path) - either way this is cleanup, not a critical operation.
  }
}

async function getOwnedTeamOrThrow(teamId: string, leaderUserId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId }, include: { members: true } });

  if (!team) throw new AppError(404, "Team not found.");
  if (team.leaderUserId !== leaderUserId) throw new AppError(403, "Not authorized for this team.");
  if (team.status !== "draft") throw new AppError(409, "Team has already been submitted and can no longer be edited.");

  return team;
}

export async function addTeamMember(teamId: string, leaderUserId: string, input: AddMemberInput) {
  const team = await getOwnedTeamOrThrow(teamId, leaderUserId);

  if (team.members.length >= TEAM_MAX_MEMBERS) {
    throw new AppError(409, `A team can have at most ${TEAM_MAX_MEMBERS} members.`);
  }

  if (team.members.some((m: TeamMember) => m.email === input.email)) {
    throw new AppError(409, "This email is already part of the team.");
  }

  // Members are recorded as data, not required to hold a user account.
  // If someone with this email has an account, we still don't auto-link
  // it - see design note in memory: identity claiming is a separate,
  // explicit flow (not implemented here), not an automatic email match.
  const newMember = await prisma.teamMember.create({
    data: {
      teamId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      role: "member",
    },
  });

  const leader = team.members.find((m: TeamMember) => m.role === "leader");
  const leaderName = leader ? `${leader.firstName} ${leader.lastName}` : "Your team leader";

  sendTeamMemberAddedEmail(
    newMember.email,
    { firstName: newMember.firstName, lastName: newMember.lastName },
    { name: team.name, institute: team.institute, theme: team.theme },
    leaderName,
  ).catch(() => {
    // Handled & logged in mailer
  });

  return newMember;
}

export async function removeTeamMember(teamId: string, leaderUserId: string, memberId: string) {
  const team = await getOwnedTeamOrThrow(teamId, leaderUserId);

  const member = team.members.find((m: TeamMember) => m.id === memberId);
  if (!member) throw new AppError(404, "Member not found.");
  if (member.role === "leader") throw new AppError(400, "The team leader cannot be removed.");

  await prisma.teamMember.delete({ where: { id: memberId } });
}

export async function submitTeam(teamId: string, leaderUserId: string) {
  const team = await getOwnedTeamOrThrow(teamId, leaderUserId);

  if (team.members.length < TEAM_MIN_MEMBERS) {
    throw new AppError(400, `A team needs at least ${TEAM_MIN_MEMBERS} members to submit.`);
  }

  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: { status: "submitted", submittedAt: new Date() },
    include: { members: true },
  });

  // Send confirmation email to all team members including leader
  const recipients = updatedTeam.members.map((m: TeamMember) => m.email);
  sendTeamRegistrationEmail(recipients, updatedTeam).catch(() => {
    // Handled & logged in mailer
  });

  return updatedTeam;
}

export async function getMyTeam(leaderUserId: string) {
  return prisma.team.findFirst({
    where: { leaderUserId },
    include: { members: true },
  });
}
