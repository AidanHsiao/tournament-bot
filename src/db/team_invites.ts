import db, { DBQueryMeta, handleMeta } from "./index";

interface DBTeamInvite {
  id: number;
  team_id: number;
  invited_user_id: string;
  inviter_user_id: string;
  retracted: boolean;
  note?: string;
  expires_at?: Date;
  inserted_at: Date;
}

interface DBTeamInviteInsertRequest {
  team_id: number;
  invited_user_id: string;
  inviter_user_id: string;
  retracted?: boolean;
}

export async function insertTeamInvite(
  req: DBTeamInviteInsertRequest
): Promise<number> {
  const rows = await db("team_invites").insert(req).returning("id");

  return rows[0];
}

interface DBTeamInviteUpdateRequest {
  retracted?: string;
  note?: string;
  expires_at?: Date;
  where: {
    id?: number;
    team_id?: number;
    invited_user_id?: string;
    inviter_user_id?: string;
    retracted?: boolean;
  };
}

export async function updateTeamInvite(
  req: DBTeamInviteUpdateRequest
): Promise<void> {
  const { retracted, note, expires_at, where } = req;

  const update = {};

  if (retracted) {
    update["retracted"] = retracted;
  }

  if (note) {
    update["note"] = note;
  }

  if (expires_at) {
    update["expires_at"] = expires_at;
  }

  await db("team_invites").where(where).update(update);
}

interface DBTeamInviteDeleteRequest {
  id?: number;
  team_id?: number;
  invited_user_id?: number;
  inviter_user_id?: number;
  retracted?: boolean;
}

export async function deleteTeamInvite(
  req: DBTeamInviteDeleteRequest
): Promise<void> {
  await db("team_invites").where(req).del();
}

interface DBTeamInviteListRequestMeta extends DBQueryMeta {
  valid_only: boolean;
}

interface DBTeamInviteListRequest {
  id?: number;
  team_id?: number;
  invited_user_id?: string;
  inviter_user_id?: string;
  retracted?: string;

  meta?: DBTeamInviteListRequestMeta;
}

export async function listTeamInvites(
  req: DBTeamInviteListRequest
): Promise<DBTeamInvite[]> {
  const {
    id,
    team_id,
    invited_user_id,
    inviter_user_id,
    retracted,
    meta,
  } = req;
  const query = db("team_invites");

  if (id) {
    query.where({ id });
  }

  if (team_id) {
    query.where({ team_id });
  }

  if (invited_user_id) {
    query.where({ invited_user_id });
  }

  if (inviter_user_id) {
    query.where({ inviter_user_id });
  }

  if (retracted) {
    query.where({ retracted });
  }

  if (meta) {
    if (meta.valid_only) {
      query.where({
        retracted: false,
      });

      query.where("expires_at", "<", db.fn.now()).orWhere("expires_at", null);
    }

    handleMeta(query, meta);
  }

  return await query;
}
