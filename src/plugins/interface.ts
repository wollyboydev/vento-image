// We use a forward declaration or 'any' for now to avoid circular dependency
// In a full implementation, we'd have a specific interface for what Vento exposes to plugins
export interface Plugin {
  attach(gallery: any): void;
  detach(): void;
}
