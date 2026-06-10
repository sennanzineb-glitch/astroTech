import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // <-- Ajout pour intercepter l'URL
import { UserService } from '../../_services/users/user.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit, OnChanges {
  // Si fourni par un composant parent -> Mode Modification directe.
  // Si absent -> On vérifie si un ID existe dans le lien URL.
  @Input() user: any = null;

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  userForm: any = {
    full_name: '',
    email: '',
    password: '',
    role: 'user'
  };

  // Injection de ActivatedRoute
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Vérifie d'abord si un ID est présent dans la route/le lien URL
    const userIdFromUrl = this.route.snapshot.paramMap.get('id');

    if (userIdFromUrl) {
      this.loadUserById(userIdFromUrl);
    } else {
      // 2. Sinon, on initialise normalement (Ajout ou via @Input)
      this.initForm();
    }
  }

  // Permet de rafraîchir le formulaire si l'input change en cours de route
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && !changes['user'].firstChange) {
      this.initForm();
    }
  }

  // Charge les données de l'API grâce à l'ID trouvé dans l'URL
  loadUserById(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (res) => {
        // Ajustez selon la structure de votre réponse API (ex: res.data ou res.user)
        this.user = res.user || res.data || res; 
        this.initForm();
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        alert("Impossible de charger les données de l'utilisateur.");
      }
    });
  }

  initForm(): void {
    if (this.user) {
      this.userForm = {
        full_name: this.user.full_name || this.user.name || '',
        email: this.user.email || '',
        role: this.user.role ? this.user.role.toLowerCase() : 'user',
        password: '' // Non utilisé en modification, le champ sera invisible
      };
    } else {
      this.userForm = {
        full_name: '',
        email: '',
        password: '',
        role: 'user'
      };
    }
  }

  onSubmit(): void {
    if (this.user) {
      // --- LOGIQUE DE MODIFICATION ---
      const updatePayload = {
        full_name: this.userForm.full_name,
        email: this.userForm.email,
        role: this.userForm.role
      };

      // Utilise l'ID de l'utilisateur (qu'il vienne de l'input ou de l'URL)
      const idToUpdate = this.user.id || this.user._id;

      this.userService.updateUser(idToUpdate, updatePayload).subscribe({
        next: (res) => {
          if (res.success) {
            alert(`L'utilisateur "${updatePayload.full_name}" a été modifié avec succès.`);
            this.onSave.emit();
            this.router.navigate(['admin/user']);
          }
        },
        error: (err) => {
          console.error('Erreur modification:', err);
          alert("Une erreur est survenue lors de la modification de l'utilisateur.");
        }
      });

    } else {
      // --- LOGIQUE D'AJOUT ---
      const createPayload = {
        full_name: this.userForm.full_name,
        email: this.userForm.email,
        password_hash: this.userForm.password, 
        role: this.userForm.role
      };

      this.userService.createUser(createPayload).subscribe({
        next: (res) => {
          if (res.success) {
            alert(`L'utilisateur "${createPayload.full_name}" a été ajouté avec succès.`);
            this.initForm(); 
            this.onSave.emit();
            this.router.navigate(['admin/user']);
          }
        },
        error: (err) => {
          console.error('Erreur création:', err);
          alert("Une erreur est survenue lors de l'ajout de l'utilisateur.");
        }
      });
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}