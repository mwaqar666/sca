import { Component, type OnInit } from "@angular/core";
import { ConfigService } from "@sca-frontend/config";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
	public constructor(
		// Dependencies

		private readonly configService: ConfigService,
	) {}

	public ngOnInit(): void {
		const storageConfig = this.configService.get("storage");

		console.log(storageConfig.driver);
	}
}
