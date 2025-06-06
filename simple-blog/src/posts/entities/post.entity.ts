import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' }) 
    author: User;

    @Column()
    authorId: number;

    // @OneToMany(() => Comment, comment => comment.post, { cascade: true })
    // comments: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}