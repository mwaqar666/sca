import { Component, type OnInit } from "@angular/core";
import { FormBuilder, FormControl, type FormGroup, Validators } from "@angular/forms";
import type { FormControlDataType } from "@sca-frontend/utils";
import type { SignInRequestDto } from "../../dto";
import { SignInService } from "../../services";

@Component({
	selector: "auth-sign-in",
	templateUrl: "./sign-in.component.html",
	styleUrls: ["../styles/auth.styles.scss"],
})
export class SignInComponent implements OnInit {
	public signInForm: FormGroup<FormControlDataType<SignInRequestDto>>;

	public constructor(
		// Dependencies

		private readonly formBuilder: FormBuilder,
		private readonly signInService: SignInService,
	) {}

	public ngOnInit(): void {
		this.initializeForm();
	}

	public async signIn() {
		const signInDto = <SignInRequestDto>this.signInForm.value;
		const signInResponse = await this.signInService.signIn(signInDto);

		console.log(signInResponse);
	}

	private initializeForm() {
		this.signInForm = this.formBuilder.nonNullable.group({
			userEmail: new FormControl("", [Validators.required]),
			userPassword: new FormControl("", [Validators.required]),
		});
	}
}
