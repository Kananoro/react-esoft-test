import { useEffect, useState } from "react";
import { apiGet } from "../../api-get";
import { useUser } from "../../usercontext";
import { useNavigate } from "react-router-dom";
import Modal from "../../modal";
import { instance } from "../../api";
import ErrorCard from "../error";
import Loading from "../loading";

const TaskForm = () => {
	const { user, getUserData, subordinates, getSubordinates, isLoading } =
		useUser();
	const [errorText, setErrorText] = useState();
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [tasks, setTasks] = useState([]);
	const [filterTasks, setFilterTasks] = useState([]);
	const [dateFilterOpen, setDateFilterOpen] = useState(false);
	const [changeTask, setChangeTask] = useState();

	const [priorityOpen, setPriorityOpen] = useState(false);
	const priorities = ["HIGH", "MEDIUM", "LOW"];
	const [statusOpen, setStatusOpen] = useState(false);
	const statuses = ["TODO", "IN_PROGRESS", "DONE", "CANCEL"];
	const [responsibleOpen, setResponsibleOpen] = useState(false);
	const [taskResponsibleOpen, setTaskResponsibleOpen] = useState(false);

	const navigate = useNavigate();

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const week = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
	const newTaskSchema = {
		title: "",
		description: "",
		dueDate: today,
		priority: "LOW",
		status: "TODO",
		responsibleId: "",
	};
	const [newTask, setNewTask] = useState(newTaskSchema);
	const fetchTasks = async () => {
		try {
			const tasks = await apiGet.getAllTasks();
			setTasks(tasks.data);
			getUserData();
		} catch {}
	};

	const sortTasksByUpdateAt = () => {
		const sortedTasks = tasks
			.slice()
			.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
		setTasks(sortedTasks);
	};

	const filterByDay = () => {
		const filtered = filterTasks.filter((task) => {
			const dueDate = new Date(task.dueDate);
			return dueDate.toDateString() === today.toDateString();
		});
		setFilterTasks(filtered);
	};

	const filterByWeek = () => {
		const filtered = filterTasks.filter((task) => {
			const dueDate = new Date(task.dueDate);
			return dueDate >= today && dueDate <= week;
		});
		setFilterTasks(filtered);
	};

	const filterByAfterWeek = () => {
		const filtered = filterTasks.filter((task) => {
			const dueDate = new Date(task.dueDate);
			return dueDate > week;
		});
		setFilterTasks(filtered);
	};

	const filterBySubordinateId = (id) => {
		const filtered = tasks.filter((task) => {
			return id === task.responsibleId;
		});
		setFilterTasks(filtered);
	};

	const filterByResponsibleId = () => {
		const filtered = tasks
			.filter((task) => {
				const responsibleId = task.responsibleId;
				return responsibleId === user.id;
			})
			.sort((a, b) => {
				return new Date(b.updatedAt) - new Date(a.updatedAt);
			});
		setFilterTasks(filtered);
	};

	const handleLogoutClick = () => {
		localStorage.clear("token");

		navigate("/");
	};

	const handleTaskClick = (data) => {
		setChangeTask(data);
		setModalIsOpen(true);
	};

	const handleNewTaskClick = () => {
		if (user && user.id) {
			setNewTask((prev) => ({
				...prev,
				responsibleId: user.id,
			}));
		}
		setModalIsOpen(true);
	};

	const onSaveChangeTask = () => {
		try {
			instance
				.put(`/task/${changeTask.id}`, changeTask)
				.then(() => {
					setChangeTask();
					setModalIsOpen(false);
					fetchTasks();
				})
				.catch((error) => {});
		} catch (error) {}
	};

	const onCreateNewTask = () => {
		const dueDate = new Date(newTask.dueDate);
		try {
			setErrorText();
			instance
				.post(`/task`, {
					title: newTask.title,
					description: newTask.description,
					dueDate: dueDate.toISOString(),
					priority: newTask.priority,
					status: newTask.status,
					responsibleId: parseInt(newTask.responsibleId, 10),
				})
				.then(() => {
					setNewTask(newTaskSchema);
					setModalIsOpen(false);
					fetchTasks();
				})
				.catch((error) => {
					if (error.response.status === 500) {
						setErrorText("Validation error");
					}
				});
		} catch (error) {
			setErrorText(error);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	useEffect(() => {
		filterByResponsibleId();
		sortTasksByUpdateAt();
		if (user && user.role === "ADMIN") {
			getSubordinates();
		}
	}, [user]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<div className="flex flex-col justify-center items-center">
				<div className="flex flex-row justify-between w-full">
					<button onClick={() => setFilterTasks(tasks)}>Clear Filters</button>
					<button onClick={() => filterByResponsibleId()}>
						Current user Tasks
					</button>
					<button onClick={() => handleNewTaskClick()}>CreateTask</button>
				</div>
				<div className="max-h-120 overflow-auto">
					<table className="w-[1200px]">
						<thead className="bg-gray-300 text-left">
							<tr className="p-4">
								<th>Title</th>
								<th>Priority</th>
								<th>
									<button
										className="relative hover:text-gray-600"
										onClick={() => setDateFilterOpen((prev) => !prev)}>
										DueDate
									</button>
									{dateFilterOpen && (
										<div className="absolute flex flex-col rounded-xl overflow-hidden bg-white border border-black">
											<button
												className="px-2 py-1 hover:bg-gray-200"
												onClick={() => {
													filterByDay();
													setDateFilterOpen(false);
												}}>
												By Day
											</button>
											<button
												className="px-2 py-1 hover:bg-gray-200"
												onClick={() => {
													filterByWeek();
													setDateFilterOpen(false);
												}}>
												By Week
											</button>
											<button
												className="px-2 py-1 hover:bg-gray-200"
												onClick={() => {
													filterByAfterWeek();
													setDateFilterOpen(false);
												}}>
												By After Week
											</button>
										</div>
									)}
								</th>
								<th>
									{user.role === "ADMIN" ? (
										<>
											<button
												onClick={() => setResponsibleOpen((prev) => !prev)}
												className="relative hover:text-gray-600">
												Responsible
											</button>
											{responsibleOpen && (
												<div className="absolute flex flex-col rounded-xl overflow-hidden bg-white border border-black">
													{subordinates.map((user) => (
														<button
															id={user.id}
															onClick={() => {
																filterBySubordinateId(user.id);
																setResponsibleOpen(false);
															}}
															className="px-2 py-1 hover:bg-gray-200">
															{user.login}
														</button>
													))}
												</div>
											)}
										</>
									) : (
										"Responsible"
									)}
								</th>
								<th>Status</th>
								<th>Update At</th>
							</tr>
						</thead>
						<tbody className="">
							{filterTasks.map((data) => {
								const date = new Date(data.dueDate);
								const update = new Date(data.updatedAt);
								return (
									<tr
										className="bg-gray-100 cursor-pointer hover:bg-gray-200"
										key={data.id}
										onClick={() => handleTaskClick(data)}>
										<td
											className={`${
												date < today && data.status !== "DONE"
													? "text-red-500"
													: ""
											} ${data.status === "DONE" ? "text-emerald-500" : ""}`}>
											{data.title}
										</td>
										<td>{data.priority}</td>
										<td>{date.toLocaleDateString()}</td>
										<td>{data.responsible.login}</td>
										<td>{data.status}</td>
										<td>{update.toLocaleString()}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<div className="flex flex-row justify-between">
					<button onClick={() => handleLogoutClick()}>Logout</button>
				</div>
				<Modal
					isOpen={modalIsOpen}
					onClose={() => {
						setModalIsOpen((prev) => !prev);
						setChangeTask();
					}}>
					{changeTask && (
						<>
							{changeTask.responsibleId === user.id && (
								<p className="absolute top-2">
									You are responsible for this Task!
								</p>
							)}
							<label htmlFor="title">Title</label>
							<input
								type="text"
								id="title"
								className="border-y focus:outline-none border-black rounded-md px-4"
								value={changeTask.title}
								onChange={(event) =>
									setChangeTask({
										...changeTask,
										title: event.target.value,
									})
								}
							/>
							<label htmlFor="description">Description</label>
							<textarea
								className="border-y focus:outline-none border-black rounded-md px-4"
								rows={2}
								cols={50}
								type="text"
								id="description"
								value={changeTask.description}
								onChange={(event) =>
									setChangeTask({
										...changeTask,
										description: event.target.value,
									})
								}
							/>
							<label htmlFor="priority">Priority</label>
							<button
								id="priority"
								onClick={() => setPriorityOpen((prev) => !prev)}
								className="relativ">
								{changeTask.priority}
								{priorityOpen && (
									<div className="absolute z-[1] rounded-xl overflow-hidden  flex flex-col justify-center items-center border bg-white">
										{priorities.map((priority) => (
											<button
												className="py-1 px-3 hover:bg-gray-200 w-full"
												onClick={() => {
													setChangeTask({
														...changeTask,
														priority: priority,
													});
												}}>
												{priority}
											</button>
										))}
									</div>
								)}
							</button>
							<label htmlFor="status">Status</label>
							<button
								id="status"
								onClick={() => setStatusOpen((prev) => !prev)}
								className="relative">
								{changeTask.status}
								{statusOpen && (
									<div className="absolute z-[1] rounded-xl overflow-hidden  flex flex-col justify-center items-center border bg-white">
										{statuses.map((status) => (
											<button
												className="py-1 px-3 hover:bg-gray-200 w-full"
												onClick={() =>
													setChangeTask({
														...changeTask,
														status: status,
													})
												}>
												{status}
											</button>
										))}
									</div>
								)}
							</button>
							<button
								onClick={onSaveChangeTask}
								className="absolute bottom-2 right-2 px-2 py-1 rounded-2xl ">
								Save
							</button>
						</>
					)}
					{!changeTask && (
						<>
							<label htmlFor="title">Title</label>
							<input
								type="text"
								id="title"
								className="border-y focus:outline-none border-black rounded-md px-4"
								value={newTask.title}
								onChange={(event) =>
									setNewTask({
										...newTask,
										title: event.target.value,
									})
								}
							/>
							<label htmlFor="description">Description</label>
							<textarea
								className="border-y focus:outline-none border-black rounded-md px-4"
								rows={2}
								cols={50}
								type="text"
								id="description"
								value={newTask.description}
								onChange={(event) =>
									setNewTask({
										...newTask,
										description: event.target.value,
									})
								}
							/>
							<label htmlFor="priority">Priority</label>
							<button
								id="priority"
								onClick={() => setPriorityOpen((prev) => !prev)}
								className="relativ">
								{newTask.priority}
								{priorityOpen && (
									<div className="absolute z-[1] rounded-xl overflow-hidden  flex flex-col justify-center items-center border bg-white">
										{priorities.map((priority) => (
											<button
												className="py-1 px-3 hover:bg-gray-200 w-full"
												onClick={() => {
													setNewTask({
														...newTask,
														priority: priority,
													});
												}}>
												{priority}
											</button>
										))}
									</div>
								)}
							</button>
							<label htmlFor="dueDate">Due Date</label>
							<input
								className="border-y focus:outline-none border-black rounded-md px-4"
								type="date"
								id="dueDate"
								onChange={(event) => {
									setNewTask({
										...newTask,
										dueDate: `${event.target.value}T00:00:00.000Z`,
									});
								}}
							/>
							<label htmlFor="status">Status</label>
							<button
								id="status"
								onClick={() => setStatusOpen((prev) => !prev)}
								className="relative">
								{newTask.status}
								{statusOpen && (
									<div className="absolute z-[1] rounded-xl overflow-hidden  flex flex-col justify-center items-center border bg-white">
										{statuses.map((status) => (
											<button
												className="py-1 px-3 hover:bg-gray-200 w-full"
												onClick={() =>
													setNewTask({
														...newTask,
														status: status,
													})
												}>
												{status}
											</button>
										))}
									</div>
								)}
							</button>
							<label htmlFor="Responsible">Responsible</label>
							{user.role !== "ADMIN" ? (
								<label>{user.login}</label>
							) : (
								<div className="relative">
									<button
										onClick={() => {
											setTaskResponsibleOpen((prev) => !prev);
										}}>
										{newTask.responsibleId
											? `${newTask.responsibleId}`
											: `${user.id}`}
									</button>
									{taskResponsibleOpen && (
										<div className="absolute z-[1] rounded-xl overflow-hidden  flex flex-col justify-center items-center border bg-white">
											<button
												className="py-1 px-3 hover:bg-gray-200 w-full"
												onClick={() => {
													setNewTask({
														...newTask,
														responsibleId: user.id,
													});
													setTaskResponsibleOpen(false);
												}}>
												{user.login}
											</button>
											{subordinates.map((user) => (
												<button
													className="py-1 px-3 hover:bg-gray-200 w-full"
													id={user.id}
													onClick={() => {
														setNewTask({
															...newTask,
															responsibleId: user.id,
														});
														setTaskResponsibleOpen(false);
													}}>
													{user.login}
												</button>
											))}
										</div>
									)}
								</div>
							)}
							<button id="Responsible"></button>
							<ErrorCard error={errorText} />
							<button
								onClick={onCreateNewTask}
								className="absolute bottom-2 right-2 px-2 py-1 rounded-2xl ">
								Create
							</button>
						</>
					)}
				</Modal>
			</div>
		</>
	);
};

export default TaskForm;
