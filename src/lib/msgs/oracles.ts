// tslint:disable:max-classes-per-file

export class AddOracleMsg {
  public readonly OracleName: string
  public readonly Description: string
	public readonly MinConsensusThreshold: string
  public readonly Originator: string

  constructor({
		oracleName,
		description,
		minConsensusThreshold,
    originator,
  }) {
    this.OracleName = oracleName
    this.Description = description
    this.MinConsensusThreshold = minConsensusThreshold
    this.Originator = originator
  }
}

export class AddOracleResultMsg {
  public readonly OracleName: string
  public readonly Time: string
	public readonly Data: string
  public readonly Originator: string

  constructor({
		oracleName,
		time,
		data,
    originator,
  }) {
    this.OracleName = oracleName
    this.Time = time
    this.Data = data
    this.Originator = originator
  }
}
