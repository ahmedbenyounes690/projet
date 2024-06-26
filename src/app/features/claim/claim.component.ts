// claim.component.ts (modifié)
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from '@app/_services/claim.service';
import { Claim } from '@app/_models/claim';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {
  claims: Claim[] = [];
  claimForm!: FormGroup;
  currentClaimId: string | null = null;
  chatMessage: string = '';

  constructor(private claimService: ClaimService, private formBuilder: FormBuilder) {
    this.claimForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllClaims();
  }

  loadAllClaims() {
    this.claimService.getAll().subscribe(claims => {
      console.log('Claims loaded:', claims);
      this.claims = claims;
    });
  }

  onSubmit() {
    if (this.claimForm.valid) {
      const titleValue = this.claimForm.get('title')?.value?.toString(); // Ensure it's a string
      const descriptionValue = this.claimForm.get('description')?.value?.toString(); // Ensure it's a string
      const formData = new FormData();
      formData.append('title', titleValue);
      formData.append('description', descriptionValue);
      formData.forEach((value, key) => {
        console.log(key + " " + value)
      });
      if (this.currentClaimId) {
        this.claimService.update(this.currentClaimId, formData).subscribe(response => {
          console.log('Claim updated successfully', response);
          this.loadAllClaims();
          this.claimForm.reset();
          this.currentClaimId = null;
        }, error => {
          console.error('Error updating claim', error);
        });
      } else {
        this.claimService.create(formData).subscribe(response => {
          console.log('Claim created successfully', response);
          this.loadAllClaims();
          this.claimForm.reset();
        }, error => {
          console.error('Error creating claim', error);
        });
      }
    }
  }

  editClaim(claim: Claim) {
    this.currentClaimId = claim._id;
    this.claimForm.patchValue({
      title: claim.title,
      description: claim.description
    });
  }

  deleteClaim(claimId: string) {
    if (confirm('Are you sure you want to delete this claim?')) {
      this.claimService.delete(claimId).subscribe(response => {
        console.log('Claim deleted successfully', response);
        this.loadAllClaims();
      }, error => {
        console.error('Error deleting claim', error);
      });
    }
  }


}