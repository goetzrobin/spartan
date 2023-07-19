import { Component } from '@angular/core';
import {
  BrnAlertDialogCloseDirective,
  BrnAlertDialogComponent,
  BrnAlertDialogContentDirective,
  BrnAlertDialogDescriptionDirective,
  BrnAlertDialogOverlayComponent,
  BrnAlertDialogTitleDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/ui/alert-dialog/brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogContentDirective,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui/alert-dialog/helm';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-alert-dialog-preview',
  standalone: true,
  imports: [
    BrnAlertDialogComponent,
    BrnAlertDialogOverlayComponent,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    BrnAlertDialogCloseDirective,
    BrnAlertDialogTitleDirective,
    BrnAlertDialogDescriptionDirective,

    HlmAlertDialogOverlayDirective,
    HlmAlertDialogContentDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,

    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: `
    <brn-alert-dialog closeDelay="100">
      <brn-alert-dialog-overlay hlm />
      <button id="edit-profile" variant="outline" brnAlertDialogTrigger hlmBtn>Delete Account</button>
      <div hlmAlertDialogContent *brnAlertDialogContent="let ctx">
        <hlm-alert-dialog-header>
          <h3 brnAlertDialogTitle hlm>Are you absolutely sure?</h3>
          <p brnAlertDialogDescription hlm>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
          <button hlmAlertDialogAction (click)="ctx.close()">Delete account</button>
        </hlm-alert-dialog-footer>
      </div>
    </brn-alert-dialog>
  `,
})
export class AlertDialogPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
  BrnAlertDialogCloseDirective,
  BrnAlertDialogComponent,
  BrnAlertDialogContentDirective,
  BrnAlertDialogDescriptionDirective,
  BrnAlertDialogOverlayComponent,
  BrnAlertDialogTitleDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/ui/alert-dialog/brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogContentDirective,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui/alert-dialog/helm';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-alert-dialog-preview',
  standalone: true,
  imports: [
    BrnAlertDialogComponent,
    BrnAlertDialogOverlayComponent,
    BrnAlertDialogTriggerDirective,
    BrnAlertDialogContentDirective,
    BrnAlertDialogCloseDirective,
    BrnAlertDialogTitleDirective,
    BrnAlertDialogDescriptionDirective,

    HlmAlertDialogOverlayDirective,
    HlmAlertDialogContentDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,

    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: \`
    <brn-alert-dialog closeDelay="100">
      <brn-alert-dialog-overlay hlm />
      <button id="edit-profile" variant="outline" brnAlertDialogTrigger hlmBtn>Delete Account</button>
      <div hlmAlertDialogContent *brnAlertDialogContent="let ctx">
        <hlm-alert-dialog-header>
          <h3 brnAlertDialogTitle hlm>Are you absolutely sure?</h3>
          <p brnAlertDialogDescription hlm>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
          <button hlmAlertDialogAction (click)="ctx.close()">Delete account</button>
        </hlm-alert-dialog-footer>
      </div>
    </brn-alert-dialog>
  \`,
})
export class AlertDialogPreviewComponent {}
`;

export const defaultImports = `
import {
  BrnAlertDialogCloseDirective,
  BrnAlertDialogComponent,
  BrnAlertDialogContentDirective,
  BrnAlertDialogDescriptionDirective,
  BrnAlertDialogOverlayComponent,
  BrnAlertDialogTitleDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/ui/alert-dialog/brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogContentDirective,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui/alert-dialog/helm';
`;

export const defaultSkeleton = `
<brn-alert-dialog closeDelay='100'>
  <brn-alert-dialog-overlay hlm />
  <button id='edit-profile' variant='outline' brnAlertDialogTrigger hlmBtn>Delete Account</button>
  <div hlmAlertDialogContent *brnAlertDialogContent='let ctx'>
    <hlm-alert-dialog-header>
      <h3 brnAlertDialogTitle hlm>Are you absolutely sure?</h3>
      <p brnAlertDialogDescription hlm>
        This action cannot be undone. This will permanently delete your account and remove your data from our
        servers.
      </p>
    </hlm-alert-dialog-header>
    <hlm-alert-dialog-footer>
      <button hlmAlertDialogCancel (click)='ctx.close()'>Cancel</button>
      <button hlmAlertDialogAction (click)='ctx.close()'>Delete account</button>
    </hlm-alert-dialog-footer>
  </div>
</brn-alert-dialog>
`;
