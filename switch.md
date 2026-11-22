# switch

[All checks](README.md)

## ❌ brn-switch accessibility and functionality tests › default › should toggle switch state on component click

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" id="testSwitchDefault" data-state="unchecked" aria-label="test switch" data-focus-visible="false" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="720" alt="recording" src="2642c8f4effdb1f3.gif">

<img width="480" alt="screenshot" src="2642c8f4effdb1f3.png">

## ✅ brn-switch accessibility and functionality tests › default › should show visible focus indication for keyboard users

<img width="480" alt="screenshot" src="6a1c3ee04dedd900.png">

## ❌ brn-switch accessibility and functionality tests › inside label › should toggle switch state on component click

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" id="testSwitchInsideLabel" data-focus-visible="false" aria-labelledby="brn-label-1" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="820a4d03186e18bc.png">

## ❌ brn-switch accessibility and functionality tests › labeled with aria-labelledby › should toggle switch state on component click

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="false" id="testSwitchLabeledWithAria" aria-labelledby="testSwitchLabel" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="625d637ecd896cc1.png">

## ✅ brn-switch accessibility and functionality tests › disabled switch › should not be interactive when disabled

<img width="480" alt="screenshot" src="70d8c4539eb5cc9e.png">

## ❌ brn-switch accessibility and functionality tests › default › should toggle switch state on thumb click

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" id="testSwitchDefault" data-state="unchecked" aria-label="test switch" data-focus-visible="false" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="472699b4a251308a.png">

## ❌ brn-switch accessibility and functionality tests › default › should toggle switch state using [Tab][Enter] keys

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" id="testSwitchDefault" data-state="unchecked" aria-label="test switch" data-focus-visible="true" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="8765e993f021afa1.png">

## ❌ brn-switch accessibility and functionality tests › default › should toggle switch state using [Tab][Space] keys

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" id="testSwitchDefault" data-state="unchecked" aria-label="test switch" data-focus-visible="true" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="4ae864211fcb6d76.png">

## ❌ brn-switch accessibility and functionality tests › inside label › should toggle switch state by clicking on the label

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" id="testSwitchInsideLabel" data-focus-visible="false" aria-labelledby="brn-label-1" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="39ee8f3fe4cc68af.png">

## ❌ brn-switch accessibility and functionality tests › inside label › should toggle switch state on thumb click

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" id="testSwitchInsideLabel" data-focus-visible="false" aria-labelledby="brn-label-1" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="7574fd67ef2b28ff.png">

## ❌ brn-switch accessibility and functionality tests › inside label › should toggle switch state using [Tab][Enter] keys

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="true" id="testSwitchInsideLabel" aria-labelledby="brn-label-1" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="08ceafea33142656.png">

## ❌ brn-switch accessibility and functionality tests › inside label › should toggle switch state using [Tab][Space] keys

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="true" id="testSwitchInsideLabel" aria-labelledby="brn-label-1" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="7607f2ab58fdbf3c.png">

## ❌ brn-switch accessibility and functionality tests › labeled with aria-labelledby › should toggle switch state by clicking on the label

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="false" id="testSwitchLabeledWithAria" aria-labelledby="testSwitchLabel" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="794d68c8a531c3f4.png">

## ❌ brn-switch accessibility and functionality tests › labeled with aria-labelledby › should toggle switch state on thumb click

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="false" id="testSwitchLabeledWithAria" aria-labelledby="testSwitchLabel" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="913c35f4674cbe52.png">

## ❌ brn-switch accessibility and functionality tests › labeled with aria-labelledby › should toggle switch state using [Tab][Enter] keys

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="true" id="testSwitchLabeledWithAria" aria-labelledby="testSwitchLabel" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="4504e60c602e570b.png">

## ❌ brn-switch accessibility and functionality tests › labeled with aria-labelledby › should toggle switch state using [Tab][Space] keys

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-size="default" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="true" id="testSwitchLabeledWithAria" aria-labelledby="testSwitchLabel" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center ml-2 outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

<img width="480" alt="screenshot" src="42dce7f3b318ba95.png">

## ❌ brn-switch accessibility and functionality tests › form integration › should reflect changes in form values and touched state

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByRole('switch', { name: /Test Switch/i })
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByRole('switch', { name: /Test Switch/i }) with timeout 5000ms
  - waiting for getByRole('switch', { name: /Test Switch/i })
    14 × locator resolved to <button name="" value="off" tabindex="0" role="switch" type="button" data-focus="true" data-dirty="true" id="testSwitchForm" data-size="default" data-touched="true" aria-checked="false" data-disabled="false" data-state="unchecked" data-focus-visible="false" aria-labelledby="brn-label-1" class="data-disabled:cursor-not-allowed data-disabled:opacity-50 group/switch inline-flex items-center outline-none shrink-0 spartan-switch transition-all">…</button>
       - unexpected value "false"
```

| Before | After | Difference |
| --- | --- | --- |
| ![before](8be255883e7a0c2a.before.png) | ![after](8be255883e7a0c2a.after.png) | ![difference](8be255883e7a0c2a.diff.png) |
