import type { ɵElement as FormElement } from "@angular/forms";
import type { Key, Nullable } from "@sca-shared/utils";

export type FormControlDataType<TForm> = {
	[TField in Key<TForm>]: FormElement<Nullable<TForm[TField]>, never>;
};
