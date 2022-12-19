import { ChangeDetectorRef, Component, type OnDestroy, type OnInit, ViewChild } from "@angular/core";
import type { MatDrawer } from "@angular/material/sidenav";
import { ComponentGenericService, type RouteData, RouteDataBusService } from "@sca-frontend/utils";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit, OnDestroy {
	public routeData: RouteData;
	@ViewChild("drawer") public drawer: MatDrawer;

	public constructor(
		// Dependencies

		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly routeDataBusService: RouteDataBusService,
		private readonly componentGenericService: ComponentGenericService,
	) {}

	public ngOnInit(): void {
		this.listenFoRouteDataChanges();
	}

	public ngOnDestroy(): void {
		this.componentGenericService.clearSubscriptions();
	}

	private listenFoRouteDataChanges() {
		this.componentGenericService.registerSubscriptions(
			this.routeDataBusService.getRoute().subscribe((data: RouteData) => {
				this.routeData = data;
				this.changeDetectorRef.detectChanges();
			}),
		);
	}
}
