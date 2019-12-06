// tslint:disable:max-classes-per-file

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
