import { Pool } from "pg"

export class DatabaseConnectionProvider {
  private pool: Pool | null = null

  constructor(
    private hostname: string,
    private port: number,
    private username: string,
    private password: string
  ) {}

  private registerDatabaseListeners() {
    if (this.pool === null) {
      throw new Error("Database pool is not initialized.")
    }
    
    this.pool.on("connect", () => {
      console.log(`Connected to database at ${this.hostname}:${this.port}`)
    })

    this.pool.on("acquire", (client) => {
      console.log(`Client acquired: ${client}`)
    })

    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
    })

    this.pool.on("remove", (client) => {
      console.log(`Client removed: ${client}`)
    })
  }

  public connect(): void {
    if (this.pool !== null) {
      console.warn("Database connection already established.")
    }

    this.pool = new Pool({
      host: this.hostname,
      port: this.port,
      user: this.username,
      password: this.password,
    })

    this.pool.connect()
    this.registerDatabaseListeners()
  }

  public getPool(): Pool {
    if (this.pool === null) {
      throw new Error("Database pool is not initialized.")
    }
   
    return this.pool
  }
}
