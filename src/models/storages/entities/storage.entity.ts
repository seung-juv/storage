import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IStorage } from '../interfaces/storages.interface';

@Entity({ name: 'storages' })
export class Storage implements IStorage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  path: string;

  @Column({ type: 'text' })
  filename: string;

  @Column({ type: 'text' })
  mimetype: string;

  @Column({ type: 'int' })
  size: number;

  @CreateDateColumn()
  createdAt: Date;
}
