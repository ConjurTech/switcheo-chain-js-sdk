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

export class CreateOraclePropositionMsg {
  public readonly OracleName: string
<<<<<<< HEAD
//  public readonly Voter: string
  public readonly Timestamp: string
||||||| constructed merge base
  public readonly Voter: string
  public readonly Time: string
=======
//  public readonly Voter: string
<<<<<<< HEAD
  public readonly Time: string
>>>>>>> remove voter field in CreatePropositionMsg
||||||| constructed merge base
  public readonly Time: string
=======
  public readonly Timestamp: string
>>>>>>> naming
  public readonly Data: string
  public readonly Originator: string

<<<<<<< HEAD
<<<<<<< HEAD
  constructor({ oracleName, timestamp, data, originator }) {
||||||| constructed merge base
  constructor({ oracleName, voter, time, data, originator }) {
=======
  constructor({ oracleName, time, data, originator }) {
>>>>>>> remove voter field in CreatePropositionMsg
||||||| constructed merge base
  constructor({ oracleName, time, data, originator }) {
=======
  constructor({ oracleName, timestamp, data, originator }) {
>>>>>>> naming
    this.OracleName = oracleName
<<<<<<< HEAD
<<<<<<< HEAD
    this.Timestamp = timestamp
||||||| constructed merge base
    this.Voter = voter
    this.Time = time
=======
    this.Time = time
>>>>>>> remove voter field in CreatePropositionMsg
||||||| constructed merge base
    this.Time = time
=======
    this.Timestamp = timestamp
>>>>>>> naming
    this.Data = data
    this.Originator = originator
  }
}
