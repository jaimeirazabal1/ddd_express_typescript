/**
 * 🎯 CLASE BASE PARA ENTIDADES
 * 
 * En DDD, una Entidad es un objeto que:
 * - Tiene una identidad única
 * - Su identidad persiste a través del tiempo
 * - Dos entidades son iguales si tienen el mismo ID
 */

export abstract class Entity<T> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  /**
   * Getter para acceder al ID de la entidad
   */
  public get id(): T {
    return this._id;
  }

  /**
   * Dos entidades son iguales si tienen el mismo ID
   */
  public equals(entity: Entity<T>): boolean {
    if (!entity || !(entity instanceof Entity)) {
      return false;
    }

    return this._id === entity._id;
  }
} 