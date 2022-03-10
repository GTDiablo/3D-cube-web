import React, { FC, memo} from 'react';
import styles from './Sidebar.module.scss';
import classNames from "classnames";

type SidebarProps = {
    className?: string;
}

const Sidebar: FC<SidebarProps> = ({className = ''}) => {
    return (
        <div className={classNames(styles['Sidebar'], className)}>

        </div>
    );
};

export default Sidebar;
