import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormControlDataType } from "@sca-frontend/utils";
import { SignUpRequestDto } from "../../dto";

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
	) {}

	public ngOnInit(): void {
		this.initializeForm();
	}

	public signUp() {
		const signUpDto = <SignUpRequestDto>this.signUpForm.value;

		console.log(signUpDto);
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
