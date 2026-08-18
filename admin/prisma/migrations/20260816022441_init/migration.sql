-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreUsuario` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `rol` ENUM('admin', 'dev') NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ultimoAcceso` DATETIME(3) NULL,

    UNIQUE INDEX `Usuario_nombreUsuario_key`(`nombreUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `subtitulo` VARCHAR(191) NULL,
    `notaAdicional` TEXT NULL,
    `videoYoutubeUrl` VARCHAR(191) NULL,
    `cantidadesParaCotizar` JSON NOT NULL,
    `estado` ENUM('borrador', 'publicado') NOT NULL DEFAULT 'borrador',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,
    `creadoPorId` INTEGER NULL,

    UNIQUE INDEX `Producto_slug_key`(`slug`),
    INDEX `Producto_creadoPorId_idx`(`creadoPorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `productoId` INTEGER NOT NULL,

    INDEX `ImagenProducto_productoId_idx`(`productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrupoOpciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tituloGrupo` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `opciones` JSON NOT NULL,
    `productoId` INTEGER NOT NULL,

    INDEX `GrupoOpciones_productoId_idx`(`productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Noticia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `imagenDestacadaUrl` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `extracto` TEXT NOT NULL,
    `contenido` LONGTEXT NOT NULL,
    `estado` ENUM('borrador', 'publicado') NOT NULL DEFAULT 'borrador',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,
    `creadoPorId` INTEGER NULL,

    UNIQUE INDEX `Noticia_slug_key`(`slug`),
    INDEX `Noticia_creadoPorId_idx`(`creadoPorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_creadoPorId_fkey` FOREIGN KEY (`creadoPorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenProducto` ADD CONSTRAINT `ImagenProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrupoOpciones` ADD CONSTRAINT `GrupoOpciones_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Noticia` ADD CONSTRAINT `Noticia_creadoPorId_fkey` FOREIGN KEY (`creadoPorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
