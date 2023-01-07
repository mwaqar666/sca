import type { Nullable } from "@sca-shared/utils";

export interface ICloseConversation {
	agentId: Nullable<number>;
	trackingIds: Array<number>;
}
