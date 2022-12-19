import { RouteData } from "../store";

export const WithoutLayout: RouteData = {
	showHeader: false,
	showSidebar: false,
	showFooter: false,
};

export const WithCompleteLayout: RouteData = {
	showHeader: true,
	showSidebar: true,
	showFooter: true,
};
