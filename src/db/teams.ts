import db, { DBQueryMeta, handleMeta } from "./index";

interface DBTeam {
  id: number;
  tournament_id: number;
  name: string;
  tag: string;
  description?: string;
  public: boolean;
  inserted_at: Date;
}

interface DBTeamInsertRequest {
  tournament_id: number;
  name: string;
  tag: string;
  description?: string;
  public?: boolean;
}

// returns the newly created team ID
export async function insertTeam(req: DBTeamInsertRequest): Promise<number> {
  const { tournament_id, name, tag, description, public: isPublic } = req;

  const row = {
    tournament_id,
    name,
    tag,
  };

  if (description) {
    row["description"] = description;
  }

  if (isPublic) {
    row["public"] = isPublic;
  }

  const rows = await db("teams").insert(row).returning("id");

  return rows[0];
}

interface DBTeamUpdateRequest {
  tournament_id?: number;
  tag?: string;
  name?: string;
  description?: string;
  public?: boolean;
  where: {
    id?: number;
    tag?: string;
  };
}

export async function updateTeam(req: DBTeamUpdateRequest): Promise<void> {
  const query = db("teams").where(req.where);

  const update = {};

  if (req.tournament_id) {
    update["tournament_id"] = req.tournament_id;
  }

  if (req.tag) {
    update["tag"] = req.tag;
  }

  if (req.name) {
    update["name"] = req.name;
  }

  if (req.description) {
    update["description"] = req.description;
  }

  if (req.public) {
    update["public"] = req.public;
  }

  query.update(update);

  await query;
}

interface DBTeamDeleteRequest {
  id?: number;
  tournament_id?: number;
  tag?: number;
  name?: string;
  public?: boolean;
}

export async function deleteTeams(req: DBTeamDeleteRequest): Promise<void> {
  await db("teams").where(req).del();
}

interface DBListTeamsRequest {
  id?: number;
  tournament_id?: number;
  tag?: number;
  name?: string;
  public?: boolean;
  meta?: DBQueryMeta;
}

export async function listTeams(req: DBListTeamsRequest): Promise<DBTeam[]> {
  const query = db("teams");

  if (req.id) {
    query.where({ id: req.id });
  }

  if (req.tournament_id) {
    query.where({ tournament_id: req.tournament_id });
  }

  if (req.tag) {
    query.where({ tag: req.tag });
  }

  if (req.name) {
    query.where({ name: req.name });
  }

  if (req.public) {
    query.where({ public: req.public });
  }

  handleMeta(query, req.meta);

  return await query;
}
