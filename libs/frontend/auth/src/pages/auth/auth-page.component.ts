import { Component, type OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouteDataBusService } from "@sca-frontend/utils";

@Component({
	selector: "auth-page",
	templateUrl: "./auth-page.component.html",
	styleUrls: ["./auth-page.component.scss"],
})
export class AuthPageComponent implements OnInit {
	public constructor(
		// Dependencies

		private readonly activatedRoute: ActivatedRoute,
		private readonly routeDataBusService: RouteDataBusService,
	) {}

	public ngOnInit(): void {
		this.routeDataBusService.useRoute(this.activatedRoute);
	}
}
