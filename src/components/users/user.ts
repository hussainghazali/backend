import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'users'})
export class User {
  @PrimaryGeneratedColumn('increment',{name:'userid'})
  userId: number;

  @Column({name:'name'})
  name: string;

  @Column({name:'role'})
  role: string;

  @Column({name:'unit'})
  unit: string;
  
  @Column({name:'pNumber'})
  pNumber: string;

  @Column()
  password: string;

  @Column({ nullable: true,name:'refreshtoken' })
  refreshToken: string;

  @Column({ type: 'date', nullable: true, name:'refreshtokenexp' })
  refreshTokenExp: string;
}
