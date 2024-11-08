import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IAiModel } from './models/ai-model';
import { AiModelsListEndpointsService } from '@endpoints/ai-models-list-endpoints.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-model-selection',
  standalone: true,
  imports: [],
  template: ` @for (model of availableModels; track $index) {
    <div class="flex flex-row items-center justify-between w-full">
      <span class="text-mainCreme">{{ model.name }}</span>
      <button
        (click)="socketDomainEmitter.emit(aiModelServiceUrl + model.path)"
        class="border-b-[1px] border-mainOrange">
        Select
      </button>
    </div>
  }`,
})
export class ModelSelectionComponent implements OnInit {
  @Input({ required: true }) public isDisabled!: boolean;
  @Input({ required: true }) public gameName!: string;

  @Output() public socketDomainEmitter = new EventEmitter<string>();

  private _aiModelsListEndpointsService = inject(AiModelsListEndpointsService);

  public availableModels: IAiModel[] = [];
  public aiModelServiceUrl = environment.aiApiUrl;

  public ngOnInit(): void {
    this._aiModelsListEndpointsService
      .getAiModelsList(this.gameName)
      .subscribe(models => {
        this.availableModels = models;
      });
  }
}
