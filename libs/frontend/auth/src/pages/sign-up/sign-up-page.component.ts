import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouteDataBusService } from "@sca-frontend/utils";

@Component({
	selector: "auth-sign-up",
	templateUrl: "./sign-up-page.component.html",
})
export class SignUpPageComponent implements OnInit {
	public constructor(
		// Dependencies

		private readonly activatedRoute: ActivatedRoute,
		private readonly routeDataBusService: RouteDataBusService,
	) {}

	public ngOnInit(): void {
		this.routeDataBusService.useRoute(this.activatedRoute);
	}
}
