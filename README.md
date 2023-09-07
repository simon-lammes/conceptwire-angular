## Common Commands

### Page - Inline
```shell
ng generate component pages/my-component --type page --standalone --inline-style --inline-template --skip-tests --change-detection OnPush
```

### Component - Inline
```shell
ng generate component components/my-component --standalone --inline-style --inline-template --skip-tests --change-detection OnPush
```

### Component - With HTML, TS and CSS
```shell
ng generate component shared/components/my-component --standalone --skip-tests  --change-detection OnPush
```

### Service
```shell
ng g service services/my-service --skip-tests
```

### Pipe
```shell
ng g pipe pipes/my-pipe --standalone
```
