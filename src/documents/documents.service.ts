import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import {
  CommonResponse,
  ResponseReason,
} from 'src/interfaces/response.interface';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthUser, UserRole } from 'src/interfaces/auth-user.interface';
import { Prisma } from 'generated/prisma';

@Injectable()
export class DocumentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createDocument(
    createDocumentDto: CreateDocumentDto,
    user: AuthUser,
  ): Promise<CommonResponse> {
    const doc = await this.databaseService.documents.create({
      data: {
        title: createDocumentDto.title,
        content: createDocumentDto.content,
        ownerId: user.id,
      },
    });

    return {
      reason: ResponseReason.OK,
      data: doc,
    };
  }

  async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    user: AuthUser,
  ): Promise<CommonResponse> {
    const condition: DocumentLookupCondition = { id };
    if (user.role !== UserRole.Admin) {
      condition.ownerId = user.id;
    }
    const docCount = await this.databaseService.documents.count({
      where: condition,
    });

    if (!docCount) {
      throw new NotFoundException();
    }

    const updatedDoc = await this.databaseService.documents.update({
      where: condition,
      data: updateDocumentDto,
    });

    return {
      reason: ResponseReason.OK,
      data: updatedDoc,
    };
  }

  async getDocument(id: string): Promise<CommonResponse> {
    const condition: DocumentLookupCondition = { id };

    const doc = await this.databaseService.documents.findFirst({
      where: condition,
    });

    if (!doc) {
      throw new NotFoundException();
    }

    return {
      reason: ResponseReason.OK,
      data: doc,
    };
  }

  async getAllDocuments(user: AuthUser): Promise<CommonResponse> {
    const docs = await this.databaseService.documents.findMany({
      where: user.role == UserRole.Admin ? {} : { ownerId: user.id },
    });

    return {
      reason: ResponseReason.OK,
      data: docs ?? [],
    };
  }

  async deleteDocument(id: string, user: AuthUser): Promise<CommonResponse> {
    const condition: DocumentLookupCondition = { id };
    if (user.role !== UserRole.Admin) {
      condition.ownerId = user.id;
    }

    try {
      await this.databaseService.documents.delete({
        where: condition,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }
      }
      throw error;
    }

    return {
      reason: ResponseReason.OK,
    };
  }
}

type DocumentLookupCondition = {
  id: string;
  ownerId?: string;
};
