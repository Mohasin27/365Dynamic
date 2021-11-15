### Cookie compliance Module
Cookie compliance module allows you to show users messaging to consent for cookies on the site .
### Default Alert

```jsx noeditor
const CookieCompliance = require('./cookie-compliance.tsx').default;
const mockData = require('./mocks/cookie-compliance.json');

<CookieCompliance
    data={mockData.data}
    config={mockData.config}
    context={mockData.context}
    resources={mockData.resources}/>
```