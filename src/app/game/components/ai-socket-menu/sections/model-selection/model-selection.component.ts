import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IAiModel } from './models/ai-model';
import { AiModelsListEndpointsService } from '@endpoints/ai-models-list-endpoints.service';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-model-selection',
  standalone: true,
  imports: [],
  template: `
    <fieldset class="border-[1px] border-mainOrange p-2">
      <legend class="text-mainCreme font-bold px-1">Prepared models</legend>
      <div
        class="flex flex-col space-y-2 {{
          isDisabled ? 'opacity-40' : 'opacity-100'
        }}">
        @for (model of availableModels; track $index) {
          <button
            class="p-[2px] w-full rounded-md font-bold text-mainGray bg-mainCreme {{
              isDisabled ? '' : 'hover:text-mainCreme hover:bg-mainGray'
            }} ease-in-out transition-all duration-200"
            (click)="socketDomainEmitter.emit(aiModelServiceUrl + model.path)">
            {{ model.name }}
          </button>
        }
      </div>
    </fieldset>
  `,
})
export class ModelSelectionComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public isDisabled!: boolean;
  @Input({ required: true }) public gameName!: string;

  @Output() public socketDomainEmitter = new EventEmitter<string>();

  private _aiModelsListEndpointsService = inject(AiModelsListEndpointsService);

  private _getModelListSubscribtion = new Subscription();

  public availableModels: IAiModel[] = [];
  public aiModelServiceUrl = environment.aiApiUrl;

  public ngOnInit(): void {
    this._getModelListSubscribtion = this._aiModelsListEndpointsService
      .getAiModelsList(this.gameName)
      .subscribe(models => {
        this.availableModels = models;
      });
  }

  public ngOnDestroy(): void {
    this._getModelListSubscribtion.unsubscribe();
  }
}
