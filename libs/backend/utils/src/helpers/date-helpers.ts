export abstract class DateHelpers {
	public static createTimeStamp(): string {
		const dateObject = new Date();
		const year = dateObject.getUTCFullYear();
		const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
		const date = dateObject.getUTCDate().toString().padStart(2, "0");
		const hour = dateObject.getUTCHours().toString().padStart(2, "0");
		const minute = dateObject.getUTCMinutes().toString().padStart(2, "0");
		const second = dateObject.getUTCSeconds().toString().padStart(2, "0");
		const milliSecond = dateObject.getUTCMilliseconds().toString().padStart(3, "0");

		return `${year}_${month}_${date}_${hour}_${minute}_${second}_${milliSecond}`;
	}

	public static parseTimeStamp(timeStamp: string): Date {
		const timeStampSegments = timeStamp.split("_");

		if (timeStampSegments.length !== 7) throw new Error("Invalid timestamp!");

		const [year, month, date, hour, minute, second, milliSecond] = timeStampSegments;

		const isoTimeStampString = `${year}-${month}-${date}T${hour}:${minute}:${second}.${milliSecond}Z`;

		return new Date(isoTimeStampString);
	}
}
