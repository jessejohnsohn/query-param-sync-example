import {
  Directive,
  HostListener,
  Input,
  OnInit,
  ElementRef,
  Inject,
  Optional,
  SkipSelf,
  Renderer2,
  SimpleChange
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { map, filter, distinctUntilKeyChanged, tap } from "rxjs/operators";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ControlContainer,
  NgControl,
  FormControl,
  DefaultValueAccessor,
  FormControlDirective,
  NgModel,
  FormGroupDirective,
  FormControlName,
  FormGroup
} from "@angular/forms";

const serializers = {
  dates: {
    serialize: (val: any) => val,
    deserialize: (val: any) => ({ start: val.start, end: val.end })
  },
  toggle: {
    serialize: (val: any) => ({ check: val }),
    deserialize: (val: any) => ({ check: !!val })
  }
};

@Directive({
  selector: "[urlSync]",
  providers: [
    {
      provide: FormControlDirective,
      useClass: FormControlDirective
    }
  ]
})
export class UrlSyncDirective implements OnInit {
  private _subscription: Subscription;

  viewToModelUpdate = (fn: any) => {};
  @Input("urlSync") paramName;

  @HostListener("input", ["$event.target.value"]) keyup(value: any) {
    if (!this.controls) {
      this.router.navigate([], {
        queryParams: { [this.paramName]: value || null },
        queryParamsHandling: "merge"
      });
    }
  }

  constructor(
    // private readonly serializers: any,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    @Optional()
    @Inject(NG_VALUE_ACCESSOR)
    private readonly controls: ControlValueAccessor[],
    @Optional() private readonly control: FormControlDirective
  ) {
    // console.log(control);
    // if (controls) {
    //   for (let ctrl of controls) {
    //     const changeFn = ctrl.registerOnChange.bind(ctrl);
    //     ctrl.registerOnChange = (fn: any) => {
    //       const f = (val: any) => {
    //         const value = serializers[this.paramName].serialize(val);
    //         this.router.navigate([], {
    //           queryParams: { ...value },
    //           queryParamsHandling: "merge"
    //         });
    //         fn(val);
    //       };
    //       changeFn(f);
    //     };
    //   }
    // }
    console.log(control);
    if (control.valueAccessor) {
      const changeFn = control.valueAccessor.registerOnChange.bind(control);
      control.valueAccessor.registerOnChange = (fn: any) => {
        const f = (val: any) => {
          console.log("changed");
          const value = serializers[this.paramName].serialize(val);
          this.router.navigate([], {
            queryParams: { ...value },
            queryParamsHandling: "merge"
          });
          fn(val);
        };
        changeFn(f);
      };
      // control.form = control.form ? control.form : new FormControl("");
      // console.log(control.form)
      // control.ngOnChanges({
      //   form: new SimpleChange(null, null, true)
      // });
    }
  }

  ngOnInit() {
    if (serializers[this.paramName]) {
      this._subscription = this.route.queryParams
        .pipe(map(params => serializers[this.paramName].deserialize(params)))
        .subscribe(paramValue => {
          if (this.control.valueAccessor) {
            this.control.valueAccessor.writeValue(paramValue);
            // console.log(paramValue);
            // for (let ctrl of this.controls) {
            //   ctrl.writeValue(paramValue);
            // }
          } else {
            this.renderer.setProperty(
              this.el.nativeElement,
              "value",
              paramValue
            );
          }
        });
    } else {
      this._subscription = this.route.queryParams
        .pipe(
          distinctUntilKeyChanged(this.paramName),
          map(queryParams => queryParams[this.paramName] || "")
        )
        .subscribe(paramValue => {
          this.renderer.setProperty(this.el.nativeElement, "value", paramValue);
        });
    }
  }
}
