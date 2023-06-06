# UI library

## Overall Architecture

Components are made up out of a brain, which is a headless accessible implementation
of the component. A UI component can be an Angular component or an Angular directive applied
to an existing HTML element or a combination of both if the UI component is more complicated.

On top of these brain components we put our helmet. Our helmet adds SPARTAN-like swagger to our UI.
Most of the time our helmets are added by applying the hlm + component name directive.
An example:
`<button hlmBtn >...</button>` this applies the SPARTAn styles to the button element.

Appearance only UI components that do not provide any other functionality are also
Angular components, e.g. the `<hlm-skeleton/>` component allows you to build a skeleton UI.

## Roadmap

- [x] Accordion
- [x] Alert
- [ ] Alert Dialog - [RFC](https://github.com/goetzrobin/spartan/issues/4)
- [ ] Aspect Ratio
- [ ] Avatar
- [x] Badge
- [x] Button
- [ ] Calendar
- [x] Card
- [ ] Checkbox
- [ ] Collapsible
- [ ] Combobox
- [ ] Command
- [ ] Context Menu
- [ ] Data Table
- [ ] Date Picker
- [ ] Dialog
- [ ] Dropdown Menu
- [ ] Hover Card
- [x] Input
- [x] Label
- [ ] Menubar
- [ ] Navigation Menu
- [ ] Popover
- [ ] Progress
- [ ] Radio Group
- [ ] Scroll Area
- [ ] Select
- [ ] Separator
- [ ] Sheet
- [x] Skeleton
- [ ] Slider
- [x] Switch
- [ ] Table
- [ ] Tabs
- [x] Textarea (covered by hlmInput directive)
- [ ] Toast
- [x] Toggle
- [ ] Tooltip - [RFC](https://github.com/goetzrobin/spartan/issues/5)
