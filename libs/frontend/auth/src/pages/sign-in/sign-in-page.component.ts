import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouteDataBusService } from "@sca-frontend/utils";

@Component({
	selector: "auth-sign-in",
	templateUrl: "./sign-in-page.component.html",
})
export class SignInPageComponent implements OnInit {
	public constructor(
		// Dependencies

		private readonly activatedRoute: ActivatedRoute,
		private readonly routeDataBusService: RouteDataBusService,
	) {}

	public ngOnInit(): void {
		this.routeDataBusService.useRoute(this.activatedRoute);
	}
}
