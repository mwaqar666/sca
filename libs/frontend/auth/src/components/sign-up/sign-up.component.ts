import { Component, type OnInit } from "@angular/core";
import { FormBuilder, FormControl, type FormGroup, Validators } from "@angular/forms";
import type { FormControlDataType } from "@sca-frontend/utils";
import type { SignUpRequestDto } from "../../dto";
import { SignUpService } from "../../services";

@Component({
	selector: "auth-sign-up",
	templateUrl: "./sign-up.component.html",
	styleUrls: ["../styles/auth.styles.scss"],
})
export class SignUpComponent implements OnInit {
	public signUpForm: FormGroup<FormControlDataType<SignUpRequestDto>>;

	public constructor(
		// Dependencies

		private readonly formBuilder: FormBuilder,
		private readonly signUpService: SignUpService,
	) {}

	public ngOnInit(): void {
		this.initializeForm();
	}

	public async signUp() {
		const signUpDto = <SignUpRequestDto>this.signUpForm.value;
		const signUpResponse = await this.signUpService.signUp(signUpDto);

		console.log(signUpResponse);
	}

	private initializeForm() {
		this.signUpForm = this.formBuilder.nonNullable.group({
			userFirstName: new FormControl("", [Validators.required]),
			userMiddleName: new FormControl(""),
			userLastName: new FormControl("", [Validators.required]),
			userEmail: new FormControl("", [Validators.required]),
			userPassword: new FormControl("", [Validators.required]),
			userPasswordConfirm: new FormControl("", [Validators.required]),
			projectName: new FormControl("", [Validators.required]),
			projectDomain: new FormControl("", [Validators.required]),
		});
	}
}
