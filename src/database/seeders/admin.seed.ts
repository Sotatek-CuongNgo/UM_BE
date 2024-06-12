import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { admin } from 'src/master-data/admin';

export default class RoleSeeder implements Seeder {
  public async run(factory: Factory, dataSource: DataSource) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(admin.password, salt);
    admin.password = hashedPassword;
    
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.clear(User);
      await queryRunner.manager.save(User, admin);
      await queryRunner.commitTransaction();
      console.log('\nSeed role data successfully');
    } catch (e) {
      console.log('\nFailed to seed role data', e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
