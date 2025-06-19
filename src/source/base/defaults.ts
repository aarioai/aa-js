import {devicePixelRatio} from '../../browser/detect_device'
import type {t_gt_zero} from '../../aa/atype/a_define'
import type {t_size_value} from './define'
import type {Dict} from '../../aa/atype/a_define_interfaces'

export type SmallCondition = (size: t_gt_zero, original: t_size_value, want: t_size_value, isCrop: boolean) => boolean

export type ImagePatternReplacement = (resolution: t_size_value, isAlter: boolean, isCrop: boolean) => Dict

class DefaultSettings {
    imageDPR = devicePixelRatio()
    smallImageCondition: SmallCondition | null = null
    imagePatternReplacement: ImagePatternReplacement | null = null
}

const defaults = new DefaultSettings()
export default defaults