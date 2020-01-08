// tslint:disable:max-classes-per-file

export class CreateOracleMsg {
  public readonly OracleName: string
  public readonly Description: string
	public readonly MinConsensusThreshold: string
  public readonly Originator: string

  constructor({ oracleName, description, minConsensusThreshold, originator }) {
    this.OracleName = oracleName
    this.Description = description
    this.MinConsensusThreshold = minConsensusThreshold
    this.Originator = originator
  }
}
export class CreatePropositionMsg {
  public readonly OracleName: string
  public readonly Timestamp: string
  public readonly Data: string
  public readonly Originator: string

  constructor({ oracleName, timestamp, data, originator }) {
    this.OracleName = oracleName
    this.Timestamp = timestamp
    this.Data = data
    this.Originator = originator
  }
}

/*
export class CreateOracleResultMsg {
  public readonly OracleName: string
  public readonly Time: string
  public readonly Data: string
  public readonly Originator: string

  constructor({ oracleName, time, data, originator }) {
    this.OracleName = oracleName
    this.Time = time
    this.Data = data
    this.Originator = originator
  }
}

export class CreateOracleVoterMsg {
  public readonly OracleName: string
  public readonly Voter: string
  public readonly Originator: string

  constructor({ oracleName, voter, originator }) {
    this.OracleName = oracleName
    this.Voter = voter
    this.Originator = originator
  }
}
*/
