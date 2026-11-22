# field

[All checks](README.md)

## ✅ field › with textarea › should allow typing in textarea

<img width="480" alt="screenshot" src="2446386e38386c10.png">

## ✅ field › default › should render field with label, input, and description

<img width="480" alt="screenshot" src="d143064c099a5c72.png">

## ✅ field › default › should allow typing in inputs

<img width="480" alt="screenshot" src="5a82e7672995c46c.png">

## ✅ field › default › should support keyboard navigation

<img width="480" alt="screenshot" src="83950abd32a8d1a9.png">

## ✅ field › with input › should render multiple fields with descriptions

<img width="480" alt="screenshot" src="5b73a0b6889048c9.png">

## ✅ field › with input › should allow input in password field

<img width="480" alt="screenshot" src="37114cbb932d2fa1.png">

## ✅ field › with checkbox › should render fieldset with legend and checkboxes

<img width="480" alt="screenshot" src="1a4914243685d4d7.png">

## ✅ field › with checkbox › should allow checking and unchecking checkboxes

<img width="480" alt="screenshot" src="1490f62a958decdf.png">

## ✅ field › with checkbox › should render checkbox with field content

<img width="480" alt="screenshot" src="2465090e8f08033e.png">

## ✅ field › with checkbox › should have separator between field groups

<img width="480" alt="screenshot" src="a3efd515589fe099.png">

## ✅ field › with switch › should render field with switch in horizontal orientation

<img width="480" alt="screenshot" src="450a3c6f3d7d6647.png">

## ❌ field › with switch › should toggle switch

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /multi-factor authentication/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /multi-factor authentication/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /multi-factor authentication/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" id="field-2fa" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="false" aria-labelledby="brn-label-1" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="720" alt="recording" src="e156fd985f4ad1c9.gif">

| Before | After | Difference |
| --- | --- | --- |
| ![before](e156fd985f4ad1c9.before.png) | ![after](e156fd985f4ad1c9.after.png) | ![difference](e156fd985f4ad1c9.diff.png) |

## ✅ field › with radio › should render fieldset with radio group

<img width="480" alt="screenshot" src="42dcd2a08ae747e8.png">

## ✅ field › with select › should allow selecting an option

<img width="480" alt="screenshot" src="88d57526471ec47f.png">

## ✅ field › with textarea › should render field with textarea

<img width="480" alt="screenshot" src="498d935b280af555.png">

## ✅ field › with error › should render fields with error states

<img width="480" alt="screenshot" src="1dc9887acd50b49c.png">

## ✅ field › with error › should have data-invalid attribute on field wrapper

<img width="480" alt="screenshot" src="e57bf493f1939a1a.png">

## ✅ field › field group › should handle disabled checkbox in first group

<img width="480" alt="screenshot" src="5579ce30811d0c9a.png">

## ✅ field › horizontal orientation › should render fields with horizontal layout

<img width="480" alt="screenshot" src="8b9bcdb6cebf9441.png">

## ❌ field › horizontal orientation › should allow interaction with horizontal fields

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Enable notifications/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Enable notifications/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Enable notifications/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="false" aria-labelledby="brn-label-1" id="field-horizontal-notifications" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="720" alt="recording" src="aae85a1d0f9c4b33.gif">

| Before | After | Difference |
| --- | --- | --- |
| ![before](aae85a1d0f9c4b33.before.png) | ![after](aae85a1d0f9c4b33.after.png) | ![difference](aae85a1d0f9c4b33.diff.png) |

## ✅ field › with field content › should render field content with label and description

<img width="480" alt="screenshot" src="257ebf78ab529ef7.png">

## ✅ field › with field content › should have checkbox checked by default

<img width="480" alt="screenshot" src="1440d0ea3cd1775b.png">

## ✅ field › with field title › should render field title above fieldset

<img width="480" alt="screenshot" src="087c3249b6a58f69.png">

## ✅ field › with field title › should allow input in fields under title

<img width="480" alt="screenshot" src="b2656924e248b25d.png">
