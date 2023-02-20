## Common Commands


### Component - Inline
```shell
ng generate component shared/components/my-component --standalone --inline-style --inline-template --skip-tests --change-detection OnPush
```

### Component - With HTML, TS and CSS
```shell
ng generate component shared/components/my-component --standalone --skip-tests  --change-detection OnPush
```

### Service
```shell
ng g service shared/services/my-service --skip-tests
```

### Pipe
```shell
ng g pipe shared/pipes/my-pipe --standalone
```

### Page - Lazy-Loaded
```shell
ng generate module customers --route customers --module app.module
```
