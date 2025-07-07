import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DocumentService } from './documents.service';
import { DatabaseService } from '../database/database.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthUser, UserRole } from '../interfaces/auth-user.interface';
import { ResponseReason } from '../interfaces/response.interface';

describe('DocumentService', () => {
  let service: DocumentService;
  let databaseService: jest.Mocked<DatabaseService>;

  const mockUser: AuthUser = {
    id: 'user-1',
    email: 'test@example.com',
    fullname: 'Test User',
    role: UserRole.Client,
  };

  const mockAdminUser: AuthUser = {
    id: 'admin-1',
    email: 'admin@example.com',
    fullname: 'Admin User',
    role: UserRole.Admin,
  };

  const mockDocument = {
    id: 'doc-1',
    title: 'Test Document',
    content: 'Test content',
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateDocumentDto: CreateDocumentDto = {
    title: 'New Document',
    content: 'New content',
  };

  const mockUpdateDocumentDto: UpdateDocumentDto = {
    title: 'Updated Document',
    content: 'Updated content',
  };

  beforeEach(async () => {
    const mockDatabaseService = {
      documents: {
        create: jest.fn().mockReturnValue(Promise.resolve()),
        update: jest.fn().mockReturnValue(Promise.resolve()),
        findFirst: jest.fn().mockReturnValue(Promise.resolve()),
        findMany: jest.fn().mockReturnValue(Promise.resolve()),
        count: jest.fn().mockReturnValue(Promise.resolve()),
        delete: jest.fn().mockReturnValue(Promise.resolve()),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    databaseService = module.get(
      DatabaseService,
    ) as jest.Mocked<DatabaseService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should create a document successfully', async () => {
      const expectedDocument = { ...mockDocument, ...mockCreateDocumentDto };
      (databaseService.documents.create as jest.Mock).mockResolvedValue(
        expectedDocument,
      );

      const result = await service.createDocument(
        mockCreateDocumentDto,
        mockUser,
      );

      expect(databaseService.documents.create).toHaveBeenCalledWith({
        data: {
          title: mockCreateDocumentDto.title,
          content: mockCreateDocumentDto.content,
          ownerId: mockUser.id,
        },
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: expectedDocument,
      });
    });

    it('should handle database errors during creation', async () => {
      const error = new Error('Database error');
      (databaseService.documents.create as jest.Mock).mockRejectedValue(error);

      await expect(
        service.createDocument(mockCreateDocumentDto, mockUser),
      ).rejects.toThrow('Database error');
    });
  });

  describe('updateDocument', () => {
    it('should update a document successfully for document owner', async () => {
      const documentId = 'doc-1';
      const expectedDocument = { ...mockDocument, ...mockUpdateDocumentDto };

      (databaseService.documents.count as jest.Mock).mockResolvedValue(1);
      (databaseService.documents.update as jest.Mock).mockResolvedValue(
        expectedDocument,
      );

      const result = await service.updateDocument(
        documentId,
        mockUpdateDocumentDto,
        mockUser,
      );

      expect(databaseService.documents.count).toHaveBeenCalledWith({
        where: { id: documentId, ownerId: mockUser.id },
      });
      expect(databaseService.documents.update).toHaveBeenCalledWith({
        where: { id: documentId, ownerId: mockUser.id },
        data: mockUpdateDocumentDto,
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: expectedDocument,
      });
    });

    it('should update any document for admin user', async () => {
      const documentId = 'doc-1';
      const expectedDocument = { ...mockDocument, ...mockUpdateDocumentDto };

      (databaseService.documents.count as jest.Mock).mockResolvedValue(1);
      (databaseService.documents.update as jest.Mock).mockResolvedValue(
        expectedDocument,
      );

      const result = await service.updateDocument(
        documentId,
        mockUpdateDocumentDto,
        mockAdminUser,
      );

      expect(databaseService.documents.count).toHaveBeenCalledWith({
        where: { id: documentId },
      });
      expect(databaseService.documents.update).toHaveBeenCalledWith({
        where: { id: documentId },
        data: mockUpdateDocumentDto,
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: expectedDocument,
      });
    });

    it('should throw NotFoundException when document does not exist', async () => {
      const documentId = 'non-existent';

      (databaseService.documents.count as jest.Mock).mockResolvedValue(0);

      await expect(
        service.updateDocument(documentId, mockUpdateDocumentDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors during update', async () => {
      const documentId = 'doc-1';
      const error = new Error('Database error');

      (databaseService.documents.count as jest.Mock).mockResolvedValue(1);
      (databaseService.documents.update as jest.Mock).mockRejectedValue(error);

      await expect(
        service.updateDocument(documentId, mockUpdateDocumentDto, mockUser),
      ).rejects.toThrow('Database error');
    });
  });

  describe('getDocument', () => {
    it('should return a document successfully', async () => {
      const documentId = 'doc-1';

      (databaseService.documents.findFirst as jest.Mock).mockResolvedValue(
        mockDocument,
      );

      const result = await service.getDocument(documentId);

      expect(databaseService.documents.findFirst).toHaveBeenCalledWith({
        where: { id: documentId },
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: mockDocument,
      });
    });

    it('should throw NotFoundException when document does not exist', async () => {
      const documentId = 'non-existent';

      (databaseService.documents.findFirst as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.getDocument(documentId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle database errors during retrieval', async () => {
      const documentId = 'doc-1';
      const error = new Error('Database error');

      (databaseService.documents.findFirst as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(service.getDocument(documentId)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents for admin user', async () => {
      const mockDocuments = [mockDocument, { ...mockDocument, id: 'doc-2' }];

      (databaseService.documents.findMany as jest.Mock).mockResolvedValue(
        mockDocuments,
      );

      const result = await service.getAllDocuments(mockAdminUser);

      expect(databaseService.documents.findMany).toHaveBeenCalledWith({
        where: {},
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: mockDocuments,
      });
    });

    it('should return only user documents for non-admin user', async () => {
      const mockDocuments = [mockDocument];

      (databaseService.documents.findMany as jest.Mock).mockResolvedValue(
        mockDocuments,
      );

      const result = await service.getAllDocuments(mockUser);

      expect(databaseService.documents.findMany).toHaveBeenCalledWith({
        where: { ownerId: mockUser.id },
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: mockDocuments,
      });
    });

    it('should return empty array when no documents found', async () => {
      (databaseService.documents.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getAllDocuments(mockUser);

      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: [],
      });
    });

    it('should handle null response from database', async () => {
      (databaseService.documents.findMany as jest.Mock).mockResolvedValue(null);

      const result = await service.getAllDocuments(mockUser);

      expect(result).toEqual({
        reason: ResponseReason.OK,
        data: [],
      });
    });

    it('should handle database errors during retrieval', async () => {
      const error = new Error('Database error');

      (databaseService.documents.findMany as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(service.getAllDocuments(mockUser)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document successfully for document owner', async () => {
      const documentId = 'doc-1';

      (databaseService.documents.delete as jest.Mock).mockResolvedValue(
        mockDocument,
      );

      const result = await service.deleteDocument(documentId, mockUser);

      expect(databaseService.documents.delete).toHaveBeenCalledWith({
        where: { id: documentId, ownerId: mockUser.id },
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
      });
    });

    it('should delete any document for admin user', async () => {
      const documentId = 'doc-1';

      (databaseService.documents.delete as jest.Mock).mockResolvedValue(
        mockDocument,
      );

      const result = await service.deleteDocument(documentId, mockAdminUser);

      expect(databaseService.documents.delete).toHaveBeenCalledWith({
        where: { id: documentId },
      });
      expect(result).toEqual({
        reason: ResponseReason.OK,
      });
    });

    it('should throw NotFoundException when document does not exist', async () => {
      const documentId = 'non-existent';
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record to delete does not exist.',
        {
          code: 'P2025',
          clientVersion: '1.0.0',
        },
      );

      (databaseService.documents.delete as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(
        service.deleteDocument(documentId, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rethrow non-P2025 Prisma errors', async () => {
      const documentId = 'doc-1';
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed.',
        {
          code: 'P2003',
          clientVersion: '1.0.0',
        },
      );

      (databaseService.documents.delete as jest.Mock).mockRejectedValue(
        prismaError,
      );

      await expect(
        service.deleteDocument(documentId, mockUser),
      ).rejects.toThrow(prismaError);
    });

    it('should rethrow non-Prisma errors', async () => {
      const documentId = 'doc-1';
      const error = new Error('Database connection failed');

      (databaseService.documents.delete as jest.Mock).mockRejectedValue(error);

      await expect(
        service.deleteDocument(documentId, mockUser),
      ).rejects.toThrow('Database connection failed');
    });
  });
});
