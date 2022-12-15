import type { UserEntity } from "../../domains";

export class FailedAuthReasonUser {
	authUser: null;
	authErrorReason: "user";
}

export class FailedAuthReasonProject {
	authUser: null;
	authErrorReason: "project";
}

export class SuccessfulAuthWithUserAndProject {
	authUser: UserEntity;
	authErrorReason: null;
}
