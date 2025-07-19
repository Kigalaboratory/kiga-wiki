-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" INTEGER,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("author", "content", "createdAt", "id") SELECT "author", "content", "createdAt", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
