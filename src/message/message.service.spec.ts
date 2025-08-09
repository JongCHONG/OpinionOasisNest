import { MessageService } from "./message.service";
import { Repository } from "typeorm";
import { Message } from "./message.entity";
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";

jest.mock("./message.entity");

describe("MessageService", () => {
  let service: MessageService;
  let repo: jest.Mocked<Repository<Message>>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Message>>;
    service = new MessageService(repo);
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  describe("create", () => {
    it("should create and save a message", async () => {
      const data = { text: "Hello" };
      const created: Message = {
        id: "1",
        text: "Hello",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null,
      };
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(data);
      expect(repo.create).toHaveBeenCalledWith(data);
      expect(repo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });

    it("should throw BadRequestException on error", async () => {
      repo.create.mockImplementation(() => {
        throw new Error("fail");
      });
      await expect(service.create({})).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("should return all messages", async () => {
      const messages = [{ id: "1" }, { id: "2" }] as Message[];
      repo.find.mockResolvedValue(messages);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toBe(messages);
    });

    it("should throw BadRequestException on error", async () => {
      repo.find.mockRejectedValue(new Error("fail"));
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe("findById", () => {
    it("should return a message by id", async () => {
      const message = { id: "1" } as Message;
      repo.findOne.mockResolvedValue(message);

      const result = await service.findById("1");
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(result).toBe(message);
    });

    it("should throw NotFoundException if not found", async () => {
      repo.findOne.mockResolvedValue(undefined);
      await expect(service.findById("1")).rejects.toThrow(NotFoundException);
    });

    it("should throw InternalServerErrorException on other errors", async () => {
      repo.findOne.mockRejectedValue(new Error("fail"));
      await expect(service.findById("1")).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("update", () => {
    it("should update and return the message", async () => {
      repo.update.mockResolvedValue({ affected: 1 } as any);
      const message = { id: "1" } as Message;
      jest.spyOn(service, "findById").mockResolvedValue(message);

      const result = await service.update("1", { text: "Updated" });
      expect(repo.update).toHaveBeenCalledWith("1", { text: "Updated" });
      expect(result).toBe(message);
    });

    it("should throw NotFoundException if nothing updated", async () => {
      repo.update.mockResolvedValue({ affected: 0 } as any);
      await expect(service.update("1", {})).rejects.toThrow(NotFoundException);
    });

    it("should throw InternalServerErrorException on other errors", async () => {
      repo.update.mockRejectedValue(new Error("fail"));
      await expect(service.update("1", {})).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("delete", () => {
    it("should delete the message", async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);
      await expect(service.delete("1")).resolves.toBeUndefined();
      expect(repo.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if nothing deleted", async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.delete("1")).rejects.toThrow(NotFoundException);
    });

    it("should throw InternalServerErrorException on other errors", async () => {
      repo.delete.mockRejectedValue(new Error("fail"));
      await expect(service.delete("1")).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
