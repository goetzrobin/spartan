import { Component, EventEmitter, Output } from '@angular/core';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
import { SidePanelLinkDirective } from './side-panel-link.directive';
import { SidePanelLinksComponent } from './side-panel-links.directive';
import { SidePanelHeadingDirective } from './side-panel-heading.directive';

@Component({
  selector: 'spartan-side-panel-nav',
  standalone: true,
  imports: [HlmScrollAreaComponent, SidePanelLinkDirective, SidePanelLinksComponent, SidePanelHeadingDirective],
  host: {
    class: 'block',
  },
  template: ` <div class="pb-4">
      <h4 spartanSidePanelHeading>Getting Started</h4>
      <spartan-side-panel-links>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/introduction">Introduction</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/cli">CLI</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/changelog">Changelog</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/about">About & Credits</a>
      </spartan-side-panel-links>
    </div>

    <div class="pb-4">
      <h4 spartanSidePanelHeading>Stack</h4>
      <spartan-side-panel-links>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/stack/overview">Overview</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/stack/technologies">Technologies</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/stack/installation">Installation</a>
      </spartan-side-panel-links>
    </div>

    <div class="pb-4">
      <h4 spartanSidePanelHeading>UI</h4>
      <spartan-side-panel-links>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/installation">Installation</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/theming">Theming</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/dark-mode">Dark mode</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/typography">Typography</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/documentation/figma">Figma</a>
      </spartan-side-panel-links>
    </div>

    <div class="pb-4">
      <h4 spartanSidePanelHeading>Components</h4>
      <spartan-side-panel-links>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/accordion">Accordion</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/alert">Alert</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/alert-dialog">Alert Dialog</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/aspect-ratio">Aspect Ratio</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/avatar">Avatar</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/badge">Badge</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/button">Button</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/calendar">Calendar</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/card">Card</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/checkbox">Checkbox</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/collapsible">Collapsible</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/combobox">Combobox</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/command">Command</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/menu">Context Menu</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/table">Data Table</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/picker">Date Picker</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/dialog">Dialog</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/dropdown-menu">Dropdown Menu</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/form">Form</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/hover-card">Hover Card</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/input">Input</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/label">Label</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/menubar">Menubar</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/navigation-menu">Navigation Menu</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/popover">Popover</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/progress">Progress</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/radio-group">Radio Group</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/scroll-area">Scroll Area</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/select">Select</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/separator">Separator</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/sheet">Sheet</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/skeleton">Skeleton</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/slider">Slider</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/switch">Switch</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/table">Table</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/tabs">Tabs</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/textarea">Textarea</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/toast">Toast</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/toggle">Toggle</a>
        <a (click)="linkClicked.emit()" spartanSidePanelLink="/components/tooltip">Tooltip</a>
      </spartan-side-panel-links>
    </div>`,
})
export class SidePanelNavComponent {
  @Output()
  linkClicked = new EventEmitter<void>();
}
