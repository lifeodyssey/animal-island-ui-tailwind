// Global Tailwind v4 token/style entry (design tokens, base resets, component styles)
import './styles/index.css';

// Bundled @fontsource font-face declarations (Nunito, Noto Sans SC).
// Consumers who want to provide their own fonts can import
// `animal-island-ui-tailwind/style/core` instead of the default
// `animal-island-ui-tailwind/style` to skip these font assets.

// Nunito (latin subset only)
import '@fontsource/nunito/latin-500.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-900.css';

// Noto Sans SC (Chinese Simplified — rounded CJK fallback)
import '@fontsource/noto-sans-sc/latin-400.css';
import '@fontsource/noto-sans-sc/latin-500.css';
import '@fontsource/noto-sans-sc/latin-700.css';
import '@fontsource/noto-sans-sc/chinese-simplified-400.css';
import '@fontsource/noto-sans-sc/chinese-simplified-500.css';
import '@fontsource/noto-sans-sc/chinese-simplified-700.css';

// ============================================
// 基础 UI 组件
// ============================================
export { Button } from './components/Button';
export type { ButtonProps, ButtonType, ButtonSize, ButtonHTMLType } from './components/Button';

export { Input } from './components/Input';
export type { InputProps, InputSize, InputStatus } from './components/Input';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchSize } from './components/Switch';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { Card } from './components/Card';
export type { CardProps, CardType, CardColor, CardPattern } from './components/Card';

export { Title } from './components/Title';
export type { TitleProps, TitleSize, TitleColor } from './components/Title';

export { Footer } from './components/Footer';
export type { FooterProps, FooterType } from './components/Footer';

export { Collapse } from './components/Collapse';
export type { CollapseProps } from './components/Collapse';

export { Cursor } from './components/Cursor';
export type { CursorProps } from './components/Cursor';

export { Time } from './components/Time';
export type { TimeProps } from './components/Time';

export { Phone } from './components/Phone';
export type { PhoneProps } from './components/Phone';

export { Divider } from './components/Divider';
export type { DividerProps, DividerType } from './components/Divider';

export { Typewriter } from './components/Typewriter';
export type { TypewriterProps } from './components/Typewriter';

export { Icon, ICON_LIST, ITEM_LIST, ITEM_COUNT } from './components/Icon';
export type { IconProps, IconName } from './components/Icon';

export { Wallet } from './components/Wallet';
export type { WalletProps, WalletSize } from './components/Wallet';

export { Form, FormItem, useForm } from './components/Form';
export type {
    ColProps,
    FieldData,
    FormInstance,
    FormItemLayout,
    FormItemProps,
    FormLabelAlign,
    FormLayout,
    FormProps,
    FormProviderProps,
    FormSize,
    NamePath,
    RequiredMark,
    RuleObject,
    RuleRender,
    RuleType,
    Rules,
    ScrollOptions,
    StoreValue,
    ValidateError,
    ValidateInfo,
    ValidateStatus,
} from './components/Form';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { Tabs } from './components/Tabs';
export type { TabsProps, TabItem } from './components/Tabs';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps, CheckboxOption, CheckboxSize } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps, RadioOption, RadioSize } from './components/Radio';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipPlacement, TooltipTrigger, TooltipVariant } from './components/Tooltip';

export { CodeBlock } from './components/CodeBlock';
export type { CodeBlockProps } from './components/CodeBlock';

export { Loading } from './components/Loading';
export type { LoadingProps } from './components/Loading';

export { Table } from './components/Table';
export type { TableProps, TableColumn } from './components/Table';

export { WeddingInvitation, WeddingInvitationExportButton } from './components/WeddingInvitation';
export type {
    WeddingInvitationProps,
    WeddingInvitationRef,
    WeddingInvitationExportButtonProps,
} from './components/WeddingInvitation';

export { Tag } from './components/Tag';
export type { TagProps, TagSize, TagVariant, TagColor } from './components/Tag';

export {
    Notification,
    NotificationView,
    notificationOpen,
    notificationDestroy,
    NOTIFICATION_DEFAULT_DURATION,
} from './components/Notification';
export type {
    NotificationConfig,
    NotificationItem,
    NotificationPosition,
    NotificationType,
    NotificationPlacement,
    NotificationViewProps,
    NotificationStatic,
} from './components/Notification';

export { Drawer } from './components/Drawer';
export type { DrawerProps, DrawerPlacement } from './components/Drawer';

export { Progress } from './components/Progress';
export type { ProgressProps, ProgressSize, ProgressInfoPosition } from './components/Progress';

export { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from './components/Skeleton';
export type { SkeletonProps, SkeletonVariant, SkeletonButtonProps, SkeletonInputProps, SkeletonAvatarProps } from './components/Skeleton';

export { BackTop } from './components/BackTop';
export type { BackTopProps } from './components/BackTop';

export { Image } from './components/Image';
export type { ImageProps, ImageColor } from './components/Image';

export { Carousel } from './components/Carousel';
export type { CarouselProps } from './components/Carousel';

export { Countdown } from './components/Countdown';
export type { CountdownProps, CountdownSize, CountdownVariant } from './components/Countdown';

export { TimePicker } from './components/TimePicker';
export type { TimePickerProps, TimePickerSize, TimePickerStatus, TimePart } from './components/TimePicker';

export { DatePicker } from './components/DatePicker';
export type { DatePickerProps, DatePickerSize, DatePickerStatus, DatePickerValue } from './components/DatePicker';
