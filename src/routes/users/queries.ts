import bcrypt from "bcryptjs"
import postgres from "postgres"
import { eq } from "drizzle-orm"

import { db } from "@/db/conn"
import { users } from "@/db/schemas/users"
import { passwords } from "@/db/schemas/passwords"
import { lowercase } from "@/tools/strings"
import { logger } from "@/config/logger"

export async function findUserByEmail(email: string) {
  return await db.query.users.findFirst({ where: eq(users.email, lowercase(email)) })
}

export async function findPasswordByUserId(userId: string) {
  return await db.query.passwords.findFirst({ where: eq(passwords.userId, userId) })
}

export async function saveUser(email: string, password: string) {
  try {
    return await db.transaction(async tx => {
      const [newUser] = await tx.insert(users).values({ email }).returning()

      if (newUser == null) {
        tx.rollback()
        return
      }

      const passwordHash = await bcrypt.hash(password, 12)

      const [newPassword] = await tx
        .insert(passwords)
        .values({ userId: newUser.id, passwordHash })
        .returning({ id: passwords.id })

      if (newPassword == null) {
        tx.rollback()
        return
      }

      return newUser
    })
  }
  catch (error) {
    const log = `db failed to save user with email ${email}`
    if (error instanceof postgres.PostgresError) {
      // Prevent leaking sensitive data.
      logger.error(log, { error: error.message })
    }
    else if (error instanceof Error) {
      logger.error(log, { error: error.message, stack: error.stack })
    }
    else {
      logger.error(log, { error })
    }
  }
}
