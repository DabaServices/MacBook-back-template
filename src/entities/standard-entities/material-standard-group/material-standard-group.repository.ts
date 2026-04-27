import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MaterialStandardGroup } from './material-standard-group.model';
import { Material } from '../../material-entities/material/material.model';

@Injectable()
export class MaterialStandardGroupRepository {
  constructor(
    @InjectModel(MaterialStandardGroup)
    private readonly materialStandardGroupModel: typeof MaterialStandardGroup,
  ) {}

  async fetchMaterialsByGroupId(groupId: string) {
    const relatedMaterials = await this.materialStandardGroupModel.findAll({
      where: { groupId },
    });

    return relatedMaterials.map(
      (relatedMaterial) => relatedMaterial.dataValues.materialId,
    );
  }
}
