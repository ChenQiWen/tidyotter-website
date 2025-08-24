// 统一图标导出文件
// 使用 Material UI 图标系统

export {
  Download,
  CalendarToday,
  Menu,
  Close,
  Search,
  Home,
  Settings,
  Person,
  Email,
  Phone,
  Message,
  Add,
  Edit,
  Delete,
  Share,
  Star,
  ArrowBack,
  ExpandMore,
  ExpandLess,
  ChevronLeft,
  ChevronRight,
  MoreVert,
  MoreHoriz,
  ErrorOutline,
  Refresh,
  BugReport,
  PlayArrow,
  FolderOpen,
  Security as Shield,
} from '@mui/icons-material';

// 自定义图标示例（如果需要）
import { SvgIcon, SvgIconProps } from '@mui/material';

// 自定义图标组件示例
export function CustomIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </SvgIcon>
  );
}

// 导出类型
export type { SvgIconProps };