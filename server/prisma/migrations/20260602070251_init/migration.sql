-- CreateTable
CREATE TABLE `Province` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(12) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `examMode` VARCHAR(80) NOT NULL,
    `scoreTotal` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Province_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProvinceRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provinceId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `batch` VARCHAR(40) NOT NULL,
    `ruleSummary` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProvinceRule_provinceId_year_batch_key`(`provinceId`, `year`, `batch`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScoreRankSegment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provinceId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `subjectType` ENUM('physics', 'history') NOT NULL,
    `score` INTEGER NOT NULL,
    `sameScoreCount` INTEGER NOT NULL,
    `cumulativeRank` INTEGER NOT NULL,
    `sourceId` INTEGER NOT NULL,
    `verification` ENUM('draft', 'verified', 'rejected') NOT NULL DEFAULT 'draft',
    `importBatchId` INTEGER NULL,

    INDEX `ScoreRankSegment_provinceId_year_subjectType_cumulativeRank_idx`(`provinceId`, `year`, `subjectType`, `cumulativeRank`),
    UNIQUE INDEX `ScoreRankSegment_provinceId_year_subjectType_score_key`(`provinceId`, `year`, `subjectType`, `score`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `University` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(32) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `authority` VARCHAR(120) NULL,
    `provinceName` VARCHAR(40) NOT NULL,
    `city` VARCHAR(60) NOT NULL,
    `educationLevel` VARCHAR(40) NOT NULL,
    `levelTags` JSON NULL,
    `officialUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `University_code_key`(`code`),
    INDEX `University_provinceName_educationLevel_idx`(`provinceName`, `educationLevel`),
    INDEX `University_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UniversityGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `universityId` INTEGER NOT NULL,
    `code` VARCHAR(40) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `subjectType` ENUM('physics', 'history') NOT NULL,
    `subjectRequirements` VARCHAR(200) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UniversityGroup_universityId_code_subjectType_key`(`universityId`, `code`, `subjectType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Major` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(40) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `category` VARCHAR(80) NULL,
    `degreeType` VARCHAR(60) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Major_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupMajor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupId` INTEGER NOT NULL,
    `majorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GroupMajor_groupId_majorId_key`(`groupId`, `majorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provinceId` INTEGER NOT NULL,
    `universityId` INTEGER NOT NULL,
    `groupId` INTEGER NULL,
    `majorId` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `batch` VARCHAR(40) NOT NULL,
    `subjectType` ENUM('physics', 'history') NOT NULL,
    `minScore` INTEGER NULL,
    `minRank` INTEGER NULL,
    `avgScore` INTEGER NULL,
    `avgRank` INTEGER NULL,
    `maxScore` INTEGER NULL,
    `planCount` INTEGER NULL,
    `sourceId` INTEGER NOT NULL,
    `verification` ENUM('draft', 'verified', 'rejected') NOT NULL DEFAULT 'draft',
    `isDemo` BOOLEAN NOT NULL DEFAULT false,
    `importBatchId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AdmissionHistory_provinceId_subjectType_universityId_groupId_idx`(`provinceId`, `subjectType`, `universityId`, `groupId`, `majorId`),
    UNIQUE INDEX `AdmissionHistory_provinceId_universityId_groupId_majorId_yea_key`(`provinceId`, `universityId`, `groupId`, `majorId`, `year`, `batch`, `subjectType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provinceId` INTEGER NOT NULL,
    `universityId` INTEGER NOT NULL,
    `groupId` INTEGER NULL,
    `majorId` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `batch` VARCHAR(40) NOT NULL,
    `subjectType` ENUM('physics', 'history') NOT NULL,
    `planCount` INTEGER NOT NULL,
    `tuition` INTEGER NULL,
    `duration` VARCHAR(40) NULL,
    `sourceId` INTEGER NOT NULL,
    `verification` ENUM('draft', 'verified', 'rejected') NOT NULL DEFAULT 'draft',
    `isDemo` BOOLEAN NOT NULL DEFAULT false,
    `importBatchId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdmissionPlan_provinceId_universityId_groupId_majorId_year_b_key`(`provinceId`, `universityId`, `groupId`, `majorId`, `year`, `batch`, `subjectType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataSource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `publisher` VARCHAR(160) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `verification` ENUM('draft', 'verified', 'rejected') NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DataSource_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImportBatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kind` VARCHAR(60) NOT NULL,
    `filename` VARCHAR(260) NOT NULL,
    `checksum` VARCHAR(64) NOT NULL,
    `status` VARCHAR(40) NOT NULL,
    `importedRows` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    UNIQUE INDEX `ImportBatch_checksum_key`(`checksum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnonymousSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AnonymousSession_tokenHash_key`(`tokenHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAiQuota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `available` INTEGER NOT NULL DEFAULT 0,
    `reserved` INTEGER NOT NULL DEFAULT 0,
    `consumed` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserAiQuota_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AiUsageLedger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `predictionId` INTEGER NULL,
    `type` ENUM('grant', 'reserve', 'consume', 'release', 'topup') NOT NULL,
    `amount` INTEGER NOT NULL,
    `note` VARCHAR(240) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PredictionRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `provinceId` INTEGER NOT NULL,
    `universityId` INTEGER NOT NULL,
    `groupId` INTEGER NULL,
    `majorId` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `subjectType` ENUM('physics', 'history') NOT NULL,
    `score` INTEGER NULL,
    `rank` INTEGER NOT NULL,
    `scope` ENUM('university_min_threshold', 'group', 'major') NOT NULL,
    `probability` INTEGER NULL,
    `probabilityLow` INTEGER NULL,
    `probabilityHigh` INTEGER NULL,
    `riskLabel` VARCHAR(80) NOT NULL,
    `confidenceLevel` VARCHAR(40) NOT NULL,
    `contextHash` CHAR(64) NOT NULL,
    `explanation` JSON NULL,
    `explanationSource` VARCHAR(20) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PredictionRecord_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `PredictionRecord_contextHash_idx`(`contextHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VolunteerList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `provinceId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `subjectType` ENUM('physics', 'history') NOT NULL,
    `score` INTEGER NULL,
    `rank` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VolunteerItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listId` INTEGER NOT NULL,
    `universityId` INTEGER NOT NULL,
    `groupId` INTEGER NULL,
    `majorId` INTEGER NULL,
    `probability` INTEGER NULL,
    `riskLabel` VARCHAR(80) NOT NULL,
    `sortOrder` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VolunteerItem_listId_universityId_groupId_majorId_key`(`listId`, `universityId`, `groupId`, `majorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProvinceRule` ADD CONSTRAINT `ProvinceRule_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScoreRankSegment` ADD CONSTRAINT `ScoreRankSegment_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScoreRankSegment` ADD CONSTRAINT `ScoreRankSegment_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `DataSource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScoreRankSegment` ADD CONSTRAINT `ScoreRankSegment_importBatchId_fkey` FOREIGN KEY (`importBatchId`) REFERENCES `ImportBatch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UniversityGroup` ADD CONSTRAINT `UniversityGroup_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `University`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMajor` ADD CONSTRAINT `GroupMajor_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `UniversityGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupMajor` ADD CONSTRAINT `GroupMajor_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionHistory` ADD CONSTRAINT `AdmissionHistory_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionHistory` ADD CONSTRAINT `AdmissionHistory_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `University`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionHistory` ADD CONSTRAINT `AdmissionHistory_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `UniversityGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionHistory` ADD CONSTRAINT `AdmissionHistory_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionHistory` ADD CONSTRAINT `AdmissionHistory_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `DataSource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionHistory` ADD CONSTRAINT `AdmissionHistory_importBatchId_fkey` FOREIGN KEY (`importBatchId`) REFERENCES `ImportBatch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionPlan` ADD CONSTRAINT `AdmissionPlan_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionPlan` ADD CONSTRAINT `AdmissionPlan_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `University`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionPlan` ADD CONSTRAINT `AdmissionPlan_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `UniversityGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionPlan` ADD CONSTRAINT `AdmissionPlan_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionPlan` ADD CONSTRAINT `AdmissionPlan_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `DataSource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionPlan` ADD CONSTRAINT `AdmissionPlan_importBatchId_fkey` FOREIGN KEY (`importBatchId`) REFERENCES `ImportBatch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnonymousSession` ADD CONSTRAINT `AnonymousSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAiQuota` ADD CONSTRAINT `UserAiQuota_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AiUsageLedger` ADD CONSTRAINT `AiUsageLedger_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AiUsageLedger` ADD CONSTRAINT `AiUsageLedger_predictionId_fkey` FOREIGN KEY (`predictionId`) REFERENCES `PredictionRecord`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PredictionRecord` ADD CONSTRAINT `PredictionRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PredictionRecord` ADD CONSTRAINT `PredictionRecord_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PredictionRecord` ADD CONSTRAINT `PredictionRecord_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `University`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PredictionRecord` ADD CONSTRAINT `PredictionRecord_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `UniversityGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PredictionRecord` ADD CONSTRAINT `PredictionRecord_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VolunteerList` ADD CONSTRAINT `VolunteerList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VolunteerList` ADD CONSTRAINT `VolunteerList_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VolunteerItem` ADD CONSTRAINT `VolunteerItem_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `VolunteerList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VolunteerItem` ADD CONSTRAINT `VolunteerItem_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `University`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VolunteerItem` ADD CONSTRAINT `VolunteerItem_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `UniversityGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VolunteerItem` ADD CONSTRAINT `VolunteerItem_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
